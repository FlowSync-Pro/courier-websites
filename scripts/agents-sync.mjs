#!/usr/bin/env node
// Shows what every AI agent on this repo is doing and warns when your work would clash with theirs.
// Reads .agents/roster.json and each agent's .agents/status/<id>.md straight from that agent's branch,
// so updates are visible before anything is merged.
//
// Usage: npm run agents:sync [-- --agent <id>] [-- --no-fetch]

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};

function git(argv, { allowFail = false } = {}) {
  try {
    return execFileSync("git", argv, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (err) {
    if (allowFail) return null;
    throw err;
  }
}
const lines = (s) => (s ? s.split("\n").filter(Boolean) : []);

process.chdir(git(["rev-parse", "--show-toplevel"]));
const roster = JSON.parse(readFileSync(".agents/roster.json", "utf8"));
const remote = roster.remote ?? "origin";
const base = `${remote}/${roster.base ?? "main"}`;
const staleSeconds = (roster.staleDays ?? 14) * 86400;
const now = Math.floor(Date.now() / 1000);

if (!args.includes("--no-fetch") && git(["fetch", remote, "--prune", "--quiet"], { allowFail: true }) === null) {
  console.log(`! Could not fetch ${remote}. Showing what was fetched last time.\n`);
}
if (git(["rev-parse", "--verify", "--quiet", base], { allowFail: true }) === null) {
  console.error(`Can't find ${base}. Run: git fetch ${remote} ${roster.base ?? "main"}`);
  process.exit(1);
}

const current = git(["rev-parse", "--abbrev-ref", "HEAD"]);
const headSha = git(["rev-parse", "HEAD"]);
const byId = (id) => roster.agents.find((a) => a.id === id);
const byPrefix = (branch) => roster.agents.find((a) => branch.startsWith(a.branchPrefix));

function whoAmI() {
  const id = flag("--agent") ?? process.env.AGENT_ID;
  if (id) {
    if (!byId(id)) {
      console.error(`No agent "${id}" in .agents/roster.json. Known: ${roster.agents.map((a) => a.id).join(", ")}`);
      process.exit(1);
    }
    return byId(id);
  }
  return byPrefix(current) ?? roster.agents.find((a) => a.env && process.env[a.env]) ?? null;
}
const me = whoAmI();

// ---- Paths, ownership, claims ----

const underPrefix = (file, p) => (p.endsWith("/") ? file.startsWith(p) : file === p);
const underClaim = (file, claim) => file === claim || file.startsWith(claim.endsWith("/") ? claim : `${claim}/`);
const statusPath = (id) => `.agents/status/${id}.md`;

function ownerOf(file) {
  const status = file.match(/^\.agents\/status\/(.+)\.md$/);
  if (status) return byId(status[1]) ?? null;
  return roster.agents.find((a) => a.owns.some((p) => underPrefix(file, p))) ?? null;
}

function parseStatus(text) {
  const fields = {};
  const sections = {};
  let section = null;
  for (const line of text.split("\n")) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      section = heading[1].toLowerCase();
      sections[section] = [];
    } else if (section) {
      if (line.trim()) sections[section].push(line);
    } else {
      const field = line.match(/^(\w[\w ]*):\s*(.*)$/);
      if (field) fields[field[1].toLowerCase()] = field[2].trim();
    }
  }
  const claims = (sections.claims ?? [])
    .map((l) => (l.match(/`([^`]+)`/) ?? l.replace(/^\s*[-*]\s*/, "").match(/^(\S+)/) ?? [])[1])
    .filter((c) => c && !/^(none|nothing)\.?$/i.test(c));
  return { fields, sections, claims };
}

// ---- Branches ----

const branches = lines(
  git(["for-each-ref", "--format=%(refname:short)\t%(objectname)\t%(committerdate:unix)\t%(subject)", `refs/remotes/${remote}/`]),
)
  .map((l) => {
    const [ref, sha, ts, ...subject] = l.split("\t");
    return { ref, sha, name: ref.slice(remote.length + 1), ts: Number(ts), subject: subject.join("\t") };
  })
  .filter((b) => b.ref !== remote && b.name !== "HEAD" && b.ref !== base);

// Files a branch changes that haven't landed on the base. A file counts as landed when the base has held
// the branch's exact version since the branch point, so squash-merged work drops out even after later edits.
function pendingOn(ref) {
  const mergeBase = git(["merge-base", base, ref], { allowFail: true });
  if (!mergeBase) return [];
  const touched = lines(git(["diff", "--name-only", mergeBase, ref]));
  if (!touched.length) return [];
  const differs = new Set(lines(git(["diff", "--name-only", base, ref, "--", ...touched])));
  const landed = new Set(
    lines(git(["log", "--format=", "--raw", "--no-abbrev", "--no-renames", `${mergeBase}..${base}`]))
      .map((l) => l.match(/^:\S+ \S+ \S+ (\S+) \S+\t(.+)$/))
      .filter(Boolean)
      .map(([, blob, file]) => `${file}\0${blob}`),
  );
  const blobs = new Map(
    lines(git(["ls-tree", "-r", ref, "--", ...touched])).map((l) => {
      const [meta, file] = l.split("\t");
      return [file, meta.split(" ")[2]];
    }),
  );
  const deleted = "0".repeat(40);
  return touched.filter((f) => differs.has(f) && !landed.has(`${f}\0${blobs.get(f) ?? deleted}`));
}

// Same, for this checkout: commits, uncommitted edits, and new files.
function pendingHere() {
  const mergeBase = git(["merge-base", base, "HEAD"], { allowFail: true }) ?? base;
  const untracked = lines(git(["ls-files", "--others", "--exclude-standard"]));
  const touched = new Set([...lines(git(["diff", "--name-only", mergeBase])), ...untracked]);
  return [...new Set([...lines(git(["diff", "--name-only", base])), ...untracked])].filter((f) => touched.has(f));
}

function latestStatus(agent) {
  const refs = [base, ...branches.filter((b) => byPrefix(b.name) === agent).map((b) => b.ref)];
  let best = null;
  for (const ref of refs) {
    const ts = Number(git(["log", "-1", "--format=%ct", ref, "--", statusPath(agent.id)], { allowFail: true }) || 0);
    if (ts && (!best || ts > best.ts)) best = { ref, ts };
  }
  if (!best) return null;
  return { ...best, ...parseStatus(git(["show", `${best.ref}:${statusPath(agent.id)}`])) };
}

function ago(ts) {
  const s = Math.max(0, now - ts);
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}
const list = (files, max = 6) =>
  files.slice(0, max).join(", ") + (files.length > max ? ` (+${files.length - max} more)` : "");

// ---- Report ----

console.log("== You ==");
if (me) {
  console.log(`${me.id}: ${me.name}`);
  console.log(`Job: ${me.mission}`);
  console.log(`Owns: ${me.owns.join(", ")}`);
} else {
  console.log(`Can't tell which agent you are from branch "${current}".`);
  console.log(`Run with --agent <id>. Agents: ${roster.agents.map((a) => `${a.id} (${a.branchPrefix}*)`).join(", ")}`);
}
const behind = Number(git(["rev-list", "--count", `HEAD..${base}`]));
console.log(`Branch: ${current}${behind ? `, ${behind} commit(s) behind ${base}` : `, up to date with ${base}`}`);
if (me && current !== "HEAD" && !current.startsWith(me.branchPrefix)) {
  console.log(`! Your branches should start with "${me.branchPrefix}". Don't work on ${current} directly.`);
}

const statuses = new Map(roster.agents.map((a) => [a.id, latestStatus(a)]));

console.log("\n== Team ==");
for (const agent of roster.agents) {
  if (agent === me) continue;
  const s = statuses.get(agent.id);
  console.log(`\n${agent.id}: ${agent.name}`);
  if (!s) {
    console.log("  No status yet.");
    continue;
  }
  const f = s.fields;
  console.log(`  ${f.state ?? "?"}, updated ${ago(s.ts)} on ${s.ref}${f.branch ? `, working on branch ${f.branch}` : ""}`);
  for (const l of (s.sections["working on"] ?? []).slice(0, 4)) console.log(`  ${l.trim()}`);
  if (s.claims.length) console.log(`  Claims: ${s.claims.join(", ")}`);
}

if (me) {
  const asks = [];
  for (const [id, s] of statuses) {
    if (id === me.id || !s) continue;
    for (const l of s.sections.asks ?? []) {
      if (l.includes(`@${me.id}`) || /@(all|everyone)\b/.test(l)) asks.push(`${id}: ${l.replace(/^\s*[-*]\s*/, "")}`);
    }
  }
  console.log("\n== Asks for you ==");
  console.log(asks.length ? asks.map((a) => `- ${a}`).join("\n") : "None.");
}

console.log("\n== Open work on other branches ==");
const open = [];
const quiet = [];
for (const b of branches) {
  // Your own branch, by name or (on a detached checkout) by commit.
  if (b.name === current || b.sha === headSha) continue;
  const files = pendingOn(b.ref);
  if (!files.length || now - b.ts > staleSeconds) {
    quiet.push(b.name);
    continue;
  }
  open.push({ ...b, files, agent: byPrefix(b.name) });
}
for (const b of open) {
  const ahead = git(["rev-list", "--count", `${base}..${b.ref}`]);
  console.log(`\n${b.name} [${b.agent?.id ?? "unknown agent"}] ${ahead} commit(s) ahead, last ${ago(b.ts)}: ${b.subject}`);
  console.log(`  Changes: ${list(b.files)}`);
}
if (!open.length) console.log("None.");
if (quiet.length) console.log(`\nMerged, empty, or stale (ignored): ${quiet.join(", ")}`);

if (me) {
  const mine = pendingHere();
  const myClaims = existsSync(statusPath(me.id)) ? parseStatus(readFileSync(statusPath(me.id), "utf8")).claims : [];
  const problems = [];
  for (const file of mine) {
    const owner = ownerOf(file);
    if (owner && owner !== me) {
      problems.push(`${file} belongs to ${owner.id}. Undo it and put an Ask to @${owner.id} in your status instead.`);
    } else if (!owner && !myClaims.some((c) => underClaim(file, c))) {
      const kind = roster.shared.some((p) => underPrefix(file, p)) ? "shared" : "unassigned";
      problems.push(`${file} is ${kind}. Add it under ## Claims in ${statusPath(me.id)} before you push.`);
    }
    for (const [id, s] of statuses) {
      if (id !== me.id && s?.claims.some((c) => underClaim(file, c))) {
        problems.push(`${file} is claimed by ${id}. Wait for them, or ask them in your status.`);
      }
    }
    for (const b of open) {
      if (b.files.includes(file)) problems.push(`${file} is also changed on ${b.name} [${b.agent?.id ?? "unknown"}].`);
    }
  }
  console.log("\n== Clash check ==");
  console.log(mine.length ? `Your changes: ${list(mine, 10)}` : "You have no changes yet.");
  console.log(problems.length ? [...new Set(problems)].map((p) => `! ${p}`).join("\n") : "No clashes.");

  console.log("\n== Before you push ==");
  if (behind) console.log(`- Merge the latest base first: git merge ${base}`);
  console.log(`- Update ${statusPath(me.id)}: updated, branch, state, Working on, Claims, Done, Asks.`);
  console.log("- Commit the status file with your work, push your own branch, and open a PR to main.");
}

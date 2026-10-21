import fs from "fs/promises";
import path from "path";
import { client } from "@/config/site";
import { blobToken } from "@/lib/sql";

const TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

const CONTENT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

const MAX_BYTES = 4 * 1024 * 1024;

function safeName(name: string) {
  return /^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/i.test(name);
}

function blobPath(name: string) {
  return `sites/${client.id}/${name}`;
}

function localPath(name: string) {
  return path.join(process.cwd(), "data", "uploads", name);
}

export async function saveUpload(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return { ok: true as const, name: "" };
  if (file.size > MAX_BYTES) {
    return { ok: false as const, error: "That photo is over 4 MB. Use a smaller one." };
  }
  const extension = TYPES.get(file.type);
  if (!extension) {
    return { ok: false as const, error: "Use a JPG, PNG, WEBP, or GIF." };
  }
  const name = `${crypto.randomUUID()}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const token = blobToken();
  if (token) {
    const { put } = await import("@vercel/blob");
    await put(blobPath(name), bytes, {
      access: "private",
      token,
      contentType: file.type,
      addRandomSuffix: false,
    });
    return { ok: true as const, name };
  }
  const dir = path.join(process.cwd(), "data", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(localPath(name), bytes);
  return { ok: true as const, name };
}

export async function readUpload(name: string) {
  if (!safeName(name)) return null;
  const extension = name.split(".").pop()?.toLowerCase() ?? "jpg";
  const contentType = CONTENT[extension] ?? "application/octet-stream";
  const token = blobToken();
  if (token) {
    const { get } = await import("@vercel/blob");
    const result = await get(blobPath(name), { access: "private", token });
    if (result && result.statusCode === 200 && result.stream) {
      const bytes = new Uint8Array(await new Response(result.stream).arrayBuffer());
      return { bytes, contentType: result.blob.contentType || contentType };
    }
  }
  try {
    const bytes = await fs.readFile(localPath(name));
    return { bytes, contentType };
  } catch {
    return null;
  }
}

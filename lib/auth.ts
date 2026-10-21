import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { client } from "@/config/site";
import { SESSION_COOKIE, sessionMaxAge, signSession, verifySession } from "@/lib/session-token";

export function dashboardCredentials() {
  return {
    email: process.env.DASHBOARD_EMAIL || client.dashboard.email,
    password: process.env.DASHBOARD_PASSWORD || client.dashboard.password,
  };
}

export function passwordsMatch(input: string, expected: string) {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);
  if (left.length !== right.length) {
    timingSafeEqual(right, right);
    return false;
  }
  return timingSafeEqual(left, right);
}

export async function isAuthed() {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

export async function requireUser() {
  if (!(await isAuthed())) redirect("/login");
}

export async function startSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await signSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAge,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

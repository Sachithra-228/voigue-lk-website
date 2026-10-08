import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

const cookieName = "voigue_admin";
const sessionMaxAgeSeconds = 60 * 60 * 8;

function sign(value: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export async function verifyAdminPassword(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !hash || email.toLowerCase() !== adminEmail.toLowerCase()) return false;
  return bcrypt.compare(password, hash);
}

export async function setAdminSession(email: string) {
  const payload = `${email}:${Date.now()}`;
  const session = `${payload}.${sign(payload)}`;
  (await cookies()).set(cookieName, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(cookieName);
}

export async function requireAdmin() {
  const session = (await cookies()).get(cookieName)?.value;
  if (!session) return false;
  // The payload is "email:timestamp" and the email itself contains dots, so split on the LAST dot.
  const dot = session.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = session.slice(0, dot);
  const signature = session.slice(dot + 1);
  if (!signature) return false;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return false;

  // Enforce the 8-hour session limit on the server too, not just through the cookie's expiry.
  const issuedAt = Number(payload.slice(payload.lastIndexOf(":") + 1));
  return Number.isFinite(issuedAt) && Date.now() - issuedAt < sessionMaxAgeSeconds * 1000;
}

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

const cookieName = "voigue_admin";

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
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(cookieName);
}

export async function requireAdmin() {
  const session = (await cookies()).get(cookieName)?.value;
  if (!session) return false;
  const [payload, signature] = session.split(".");
  if (!payload || !signature) return false;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

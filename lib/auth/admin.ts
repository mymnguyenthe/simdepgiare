import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET_STRING =
  process.env.ADMIN_JWT_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "simdepgiare-default-admin-secret-key-32chars";

const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
export const ADMIN_COOKIE_NAME = "admin_session";

export function checkAdminCredentials(email: string, pass: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@simdepgiare.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  return email.trim().toLowerCase() === adminEmail.trim().toLowerCase() && pass === adminPassword;
}

export async function createAdminToken(email: string): Promise<string> {
  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSessionServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function verifyAdminRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

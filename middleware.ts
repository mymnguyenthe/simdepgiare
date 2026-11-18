import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING =
  process.env.ADMIN_JWT_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "simdepgiare-default-admin-secret-key-32chars";

const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const ADMIN_COOKIE_NAME = "admin_session";

async function isValidAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  const loggedIn = await isValidAdmin(request);

  // If not logged in and trying to access admin routes (except login)
  if (!loggedIn && isAdminRoute && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access login page
  if (loggedIn && isLoginPage) {
    const addSimUrl = new URL("/admin/them-sim", request.url);
    return NextResponse.redirect(addSimUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

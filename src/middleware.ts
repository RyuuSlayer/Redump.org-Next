import { auth } from "./app/api/auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { NextRequestWithAuth } from "next-auth/middleware"

export default async function middleware(request: NextRequestWithAuth) {
  const session = await auth()

  // If user is on login page but already authenticated, redirect to home
  if (request.nextUrl.pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If user is trying to access admin routes without admin role
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    session?.user?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login"]
}

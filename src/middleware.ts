import NextAuth from "next-auth"
import { auth } from "./app/api/auth/[...nextauth]/route"

export default auth((req) => {
  // Protect /admin routes
  const isAdmin = req.auth?.user?.role === "ADMIN"
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute && !isAdmin) {
    return Response.redirect(new URL("/login", req.url))
  }
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

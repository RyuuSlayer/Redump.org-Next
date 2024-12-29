import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"

export const { auth, handlers: { GET, POST } } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        })

        if (!user) {
          console.log("User not found:", credentials.username)
          return null
        }

        console.log("Found user:", user.username, "role:", user.role)
        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          console.log("Invalid password")
          return null
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
        console.log("JWT callback - user:", user.username, "role:", user.role)
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.username = token.username
        console.log("Session callback - user:", session.user.username, "role:", session.user.role)
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to home page after sign in
      return baseUrl
    }
  },
  session: {
    strategy: "jwt",
  },
})

import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"


const prisma = new PrismaClient()
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
      signIn: "/auth/signin",
    },
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      console.log(token, "token")
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      console.log(session, "session")
      return session;
    },
  },
  secret: process.env.AUTH_SECRET
})
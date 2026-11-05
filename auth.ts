import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/app/lib/db";
import UserModel from "@/app/lib/user-model";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const rawEmail = credentials?.email;
        const password = credentials?.password;

        if (
          typeof rawEmail !== "string" ||
          typeof password !== "string"
        ) {
          return null;
        }

        const email = rawEmail.trim().toLowerCase();

        if (
          !email ||
          email.length > 254 ||
          !password ||
          Buffer.byteLength(password, "utf8") > 72
        ) {
          return null;
        }

        await connectToDatabase();

        const user = await UserModel.findOne({ email })
          .select("+passwordHash")
          .lean();

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
});
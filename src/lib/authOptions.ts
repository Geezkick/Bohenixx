import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "Authentication Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        if (user.twoFactorEnabled) {
          const code = credentials.totpCode;
          if (!code) {
            throw new Error("2FA_REQUIRED");
          }
          const { authenticator } = await import("otplib");
          let isCodeValid = false;
          if (user.twoFactorSecret) {
            isCodeValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
          }
          if (!isCodeValid && user.backupCodes) {
            const crypto = await import("crypto");
            const hashedInput = crypto.createHash("sha256").update(code).digest("hex");
            const codes: string[] = JSON.parse(user.backupCodes);
            if (codes.includes(hashedInput)) {
              isCodeValid = true;
              const remaining = codes.filter((c) => c !== hashedInput);
              await db.user.update({
                where: { id: user.id },
                data: { backupCodes: JSON.stringify(remaining) },
              });
            }
          }
          if (!isCodeValid) {
            throw new Error("2FA_INVALID");
          }
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  callbacks: {
    async signIn({ user, account }) {
      // For Google OAuth, ensure the user exists in our DB
      if (account?.provider === "google" && user?.email) {
        try {
          const existingUser = await db.user.findUnique({ where: { email: user.email } });
          if (!existingUser) {
            // Create the user in our database
            await db.user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split("@")[0],
                image: user.image,
              },
            });
          } else {
            // Update image if changed
            if (user.image && user.image !== existingUser.image) {
              await db.user.update({
                where: { email: user.email },
                data: { image: user.image },
              });
            }
          }
        } catch (error) {
          console.error("signIn callback error:", error);
          // Don't block sign-in if DB operation fails
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // On initial sign-in, persist the user ID into the JWT
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      // For OAuth (Google), look up the DB user ID since the adapter-created user may have a different ID
      if (account && account.provider !== "credentials") {
        try {
          const dbUser = await db.user.findUnique({ where: { email: token.email! } });
          if (dbUser) {
            token.id = dbUser.id;
            token.name = dbUser.name;
          }
        } catch (error) {
          console.error("jwt callback db lookup error:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Ensure redirects stay on the same origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`;
    },
  },
};

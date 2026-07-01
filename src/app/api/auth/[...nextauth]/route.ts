import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
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
              await prisma.user.update({
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
  pages: { signIn: "/" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

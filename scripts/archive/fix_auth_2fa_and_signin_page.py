import os

# ---- 1. Create the check-2fa route (new file) ----
check2fa_dir = "src/app/api/auth/check-2fa"
check2fa_path = f"{check2fa_dir}/route.ts"
os.makedirs(check2fa_dir, exist_ok=True)

check2fa_content = '''import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ requiresTwoFactor: false });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { twoFactorEnabled: true },
    });

    return NextResponse.json({ requiresTwoFactor: !!user?.twoFactorEnabled });
  } catch (error) {
    console.error('check-2fa Error:', error);
    return NextResponse.json({ requiresTwoFactor: false });
  }
}
'''

if os.path.exists(check2fa_path):
    print(f"SKIP: {check2fa_path} already exists.")
else:
    with open(check2fa_path, "w") as f:
        f.write(check2fa_content)
    print(f"Created {check2fa_path}")

# ---- 2. Patch AuthContext.tsx login() to check 2FA status BEFORE calling signIn ----
authctx_path = "src/context/AuthContext.tsx"
with open(authctx_path, "r") as f:
    content = f.read()

with open(authctx_path + ".bak", "w") as f:
    f.write(content)

old_login = '''  const login = async (email: string, password: string, totpCode?: string) => {
    try {
      const res = await signIn("credentials", { email, password, totpCode, redirect: false });
      if (res?.error) {
        if (res.error.includes("2FA_REQUIRED")) {
          return { success: false, requiresTwoFactor: true };
        }
        if (res.error.includes("2FA_INVALID")) {
          return { success: false, requiresTwoFactor: true, error: "Invalid authentication code" };
        }
        return { success: false, error: "Invalid email or password" };
      }
      fetch("/api/auth/login-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      router.push("/dashboard");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };'''

new_login = '''  const login = async (email: string, password: string, totpCode?: string) => {
    try {
      if (!totpCode) {
        const checkRes = await fetch("/api/auth/check-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const checkData = await checkRes.json().catch(() => ({}));
        if (checkData?.requiresTwoFactor) {
          return { success: false, requiresTwoFactor: true };
        }
      }

      const res = await signIn("credentials", { email, password, totpCode, redirect: false });
      if (res?.error) {
        if (res.error.includes("2FA_INVALID")) {
          return { success: false, requiresTwoFactor: true, error: "Invalid authentication code" };
        }
        return { success: false, error: "Invalid email or password" };
      }
      fetch("/api/auth/login-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      router.push("/dashboard");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };'''

if old_login not in content:
    raise SystemExit("FAIL: login() block not found in AuthContext.tsx as expected.")
content = content.replace(old_login, new_login, 1)

with open(authctx_path, "w") as f:
    f.write(content)
print(f"Patched login() in {authctx_path}")

# ---- 3. Fix NextAuth pages.signIn to point at the real auth route ----
nextauth_path = "src/app/api/auth/[...nextauth]/route.ts"
with open(nextauth_path, "r") as f:
    content = f.read()

with open(nextauth_path + ".bak2", "w") as f:
    f.write(content)

old_pages = '''  pages: { signIn: "/auth/login" },'''
new_pages = '''  pages: { signIn: "/" },'''

if old_pages not in content:
    raise SystemExit("FAIL: pages.signIn line not found in nextauth route.ts as expected.")
content = content.replace(old_pages, new_pages, 1)

with open(nextauth_path, "w") as f:
    f.write(content)
print(f"Patched pages.signIn in {nextauth_path}")

print("\\nAll patches applied successfully.")

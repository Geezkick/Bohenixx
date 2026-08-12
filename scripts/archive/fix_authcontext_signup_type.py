path = "src/context/AuthContext.tsx"
with open(path, "r") as f:
    content = f.read()

old = '''  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;'''
new = '''  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; requiresTwoFactor?: boolean }>;'''

if old not in content:
    raise SystemExit("FAIL: signup interface line not found.")
content = content.replace(old, new, 1)

with open(path, "w") as f:
    f.write(content)
print("Fixed signup type signature.")

path = "src/app/api/2fa/status/route.ts"
with open(path, "r") as f:
    content = f.read()

old = '''    select: { twoFactorEnabled: true, hasPassword: false, password: true, name: true, email: true },'''
new = '''    select: { twoFactorEnabled: true, password: true, name: true, email: true },'''

if old not in content:
    raise SystemExit("FAIL: select line not found.")
content = content.replace(old, new, 1)

with open(path, "w") as f:
    f.write(content)
print("Fixed status route select.")

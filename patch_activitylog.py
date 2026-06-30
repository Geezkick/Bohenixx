path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

old = '''model ActivityLog {
  id        String   @id @default(cuid())
  app       String
  action    String
  color     String
  createdAt DateTime @default(now())
}'''

new = '''model ActivityLog {
  id        String   @id @default(cuid())
  userId    String?
  app       String
  action    String
  color     String
  createdAt DateTime @default(now())

  @@index([userId])
}'''

if old not in content:
    raise SystemExit("ActivityLog block not found as expected, aborting.")

content = content.replace(old, new)
with open(path, "w") as f:
    f.write(content)
print("Patched ActivityLog model.")

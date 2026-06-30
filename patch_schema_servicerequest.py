path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

with open(path + ".bak4", "w") as f:
    f.write(content)

old = '''model ServiceRequest {
  id        String   @id @default(cuid())
  service   String
  budget    String
  timeline  String
  details   String   @db.Text
  email     String
  status    String   @default("PENDING")
  createdAt DateTime @default(now())
}'''

new = '''model ServiceRequest {
  id        String   @id @default(cuid())
  userId    String?
  service   String
  budget    String
  timeline  String
  details   String   @db.Text
  email     String
  status    String   @default("PENDING")
  createdAt DateTime @default(now())
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
}'''

if old not in content:
    raise SystemExit("FAIL: ServiceRequest block not found as expected.")
content = content.replace(old, new, 1)

old_user = "  eventRsvps    EventRsvp[]\n}"
new_user = "  eventRsvps    EventRsvp[]\n  serviceRequests ServiceRequest[]\n}"
if old_user not in content:
    raise SystemExit("FAIL: User block (eventRsvps) not found as expected.")
content = content.replace(old_user, new_user, 1)

with open(path, "w") as f:
    f.write(content)
print("Patched ServiceRequest + User relation successfully.")

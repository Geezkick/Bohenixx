path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

with open(path + ".bak2", "w") as f:
    f.write(content)

old = '''model Webhook {
  id          String    @id @default(cuid())
  userId      String
  url         String
  description String?
  secret      String
  isActive    Boolean   @default(true)
  lastStatus  String?
  lastSentAt  DateTime?
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}'''

new = old + '''

model EventRsvp {
  id        String   @id @default(cuid())
  userId    String
  eventId   String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, eventId])
  @@index([userId])
}'''

if old not in content:
    raise SystemExit("Webhook model block not found as expected, aborting.")

content = content.replace(old, new)

# add relation to User model
old_user_rel = "  apiKeys       ApiKey[]\\n  webhooks      Webhook[]\\n}"
new_user_rel = "  apiKeys       ApiKey[]\\n  webhooks      Webhook[]\\n  eventRsvps    EventRsvp[]\\n}"

if old_user_rel not in content:
    raise SystemExit("User relation block not found as expected, aborting.")

content = content.replace(old_user_rel, new_user_rel)

with open(path, "w") as f:
    f.write(content)
print("Patched schema with EventRsvp model.")

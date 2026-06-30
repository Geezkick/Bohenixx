path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

with open(path + ".bak3", "w") as f:
    f.write(content)

# 1. Add eventRsvps relation to User model
old_user = "  apiKeys       ApiKey[]\n  webhooks      Webhook[]\n}"
new_user = "  apiKeys       ApiKey[]\n  webhooks      Webhook[]\n  eventRsvps    EventRsvp[]\n}"

if old_user not in content:
    raise SystemExit("FAIL: User block not found.")
content = content.replace(old_user, new_user, 1)

# 2. Append EventRsvp model at end of file (only if not already present)
if "model EventRsvp" not in content:
    content = content.rstrip("\n") + "\n\nmodel EventRsvp {\n  id        String   @id @default(cuid())\n  userId    String\n  eventId   String\n  createdAt DateTime @default(now())\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, eventId])\n  @@index([userId])\n}\n"

with open(path, "w") as f:
    f.write(content)

print("Patched successfully.")

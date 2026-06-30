import re

path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

with open(path + ".bak", "w") as f:
    f.write(content)

# 1. Add relations to User model
old_user_block = '''model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())
  accounts      Account[]
  sessions      Session[]
}'''

new_user_block = '''model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())
  accounts      Account[]
  sessions      Session[]
  apiKeys       ApiKey[]
  webhooks      Webhook[]
}'''

if old_user_block not in content:
    raise SystemExit("ERROR: User model block not found exactly as expected. Aborting, no changes made.")

content = content.replace(old_user_block, new_user_block)

# 2. Append new models at the end
new_models = '''

model ApiKey {
  id         String    @id @default(cuid())
  userId     String
  name       String
  keyPrefix  String
  keyHash    String    @unique
  lastUsedAt DateTime?
  createdAt  DateTime  @default(now())
  revokedAt  DateTime?
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Webhook {
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
}
'''

content = content.rstrip("\\n") + new_models + "\\n"

with open(path, "w") as f:
    f.write(content)

print("Schema patched successfully. Backup saved as prisma/schema.prisma.bak")

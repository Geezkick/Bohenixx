path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

before = len(content)
content = content.replace("\\n", "")
after = len(content)

with open(path, "w") as f:
    f.write(content)

print(f"Removed {before - after} characters of literal backslash-n.")

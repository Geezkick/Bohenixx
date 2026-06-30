path = "prisma/schema.prisma"
with open(path, "r") as f:
    content = f.read()

content = content.replace("}\n\\n\nmodel ApiKey", "}\n\nmodel ApiKey")

with open(path, "w") as f:
    f.write(content)

print("Fixed.")

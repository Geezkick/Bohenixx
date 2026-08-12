path = "src/context/AuthContext.tsx"
with open(path, "r") as f:
    content = f.read()

with open(path + ".bak3", "w") as f:
    f.write(content)

count = 0

old1 = '''      router.push("/dashboard");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const signup ='''
new1 = '''      window.location.assign("/dashboard");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred" };
    }
  };

  const signup ='''

if old1 in content:
    content = content.replace(old1, new1, 1)
    count += 1

old2 = '''      if (signInRes?.error) return { success: false, error: "Account created but login failed" };
      router.push("/dashboard");
      return { success: true };'''
new2 = '''      if (signInRes?.error) return { success: false, error: "Account created but login failed" };
      window.location.assign("/dashboard");
      return { success: true };'''

if old2 in content:
    content = content.replace(old2, new2, 1)
    count += 1

if count != 2:
    raise SystemExit(f"FAIL: expected 2 replacements, made {count}. Check file manually.")

with open(path, "w") as f:
    f.write(content)
print(f"Patched {count} redirect(s) in {path} to use hard navigation.")

#!/usr/bin/env python3
import os, re, sys, requests

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

try:
    import mysql.connector
except ImportError:
    print("Run: pip install mysql-connector-python --break-system-packages")
    sys.exit(1)

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
DATABASE_URL = os.environ.get("DATABASE_URL")

if not SUPABASE_URL or not SERVICE_KEY:
    print("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.")
    sys.exit(1)
if not DATABASE_URL:
    print("Missing DATABASE_URL env var.")
    sys.exit(1)

def parse_mysql_url(url):
    m = re.match(r"mysql://([^:]+):([^@]+)@([^:/]+):?(\\d+)?/(.+?)(\\?.*)?$", url)
    if not m:
        raise ValueError("Could not parse DATABASE_URL")
    user, password, host, port, db, _ = m.groups()
    return {"user": user, "password": password, "host": host, "port": int(port) if port else 3306, "database": db}

def get_supabase_users():
    users = []
    page = 1
    while True:
        resp = requests.get(
            f"{SUPABASE_URL}/auth/v1/admin/users",
            headers={"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"},
            params={"page": page, "per_page": 200},
            timeout=30,
        )
        resp.raise_for_status()
        batch = resp.json().get("users", [])
        if not batch:
            break
        users.extend(batch)
        if len(batch) < 200:
            break
        page += 1
    return users

def get_mysql_emails():
    config = parse_mysql_url(DATABASE_URL)
    # Aiven MySQL requires SSL
    config["ssl_disabled"] = False
    config["ssl_verify_cert"] = False
    config["ssl_verify_identity"] = False
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    cursor.execute("SELECT email FROM User")
    emails = {row[0].lower() for row in cursor.fetchall()}
    cursor.close()
    conn.close()
    return emails

def main():
    print("Fetching Supabase users...")
    supabase_users = get_supabase_users()
    print(f"Found {len(supabase_users)} Supabase auth users.")

    print("Fetching MySQL users...")
    mysql_emails = get_mysql_emails()
    print(f"Found {len(mysql_emails)} users in MySQL.")

    orphaned = [u for u in supabase_users if u.get("email") and u["email"].lower() not in mysql_emails]

    print(f"\\nORPHANED USERS: {len(orphaned)}\\n")
    if not orphaned:
        print("None found.")
        return
    for u in orphaned:
        name = (u.get("user_metadata") or {}).get("name", "")
        print(f"  - {u[\'email\']}  (name: {name or \'unknown\'}, created: {u.get(\'created_at\')})")

if __name__ == "__main__":
    main()

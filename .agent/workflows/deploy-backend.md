---
description: Deploy Backend to Lightnode (PM2 + PostgreSQL + Nginx)
---

# 🚀 Deploy Backend — Lightnode (Option B: PM2)

## Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │              Lightnode VPS                  │
Internet ──HTTPS──▶ │  Nginx (:443) ──▶ PM2/Node (:4000)         │
                    │       ▲                  │                  │
                    │   Certbot            Prisma                 │
                    │   (SSL)                  │                  │
                    │                   PostgreSQL (:5432)        │
                    └─────────────────────────────────────────────┘

Frontend (Vercel): songkran-aotsvb.continue-labs.com
Backend  (Lightnode): api-songkran-aotsvb.continue-labs.com
```

---

## Phase 1: Server Setup (ทำครั้งเดียว)

### 1.1 SSH เข้า Server
```bash
ssh root@<LIGHTNODE_IP>
```

### 1.2 Update ระบบ + ติดตั้ง packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx certbot python3-certbot-nginx build-essential
```

### 1.3 ติดตั้ง Node.js 22
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # ควรได้ v22.x
npm -v    # ควรได้ 10.x
```

### 1.4 ติดตั้ง PM2
```bash
sudo npm install -g pm2
```

### 1.5 ติดตั้ง PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 1.6 สร้าง Database + User
```bash
sudo -u postgres psql
```

```sql
CREATE USER songkran_user WITH PASSWORD '<STRONG_PASSWORD>';
CREATE DATABASE "songkran-online" OWNER songkran_user;
GRANT ALL PRIVILEGES ON DATABASE "songkran-online" TO songkran_user;
\q
```

ทดสอบ connection:
```bash
psql -U songkran_user -d songkran-online -h localhost
# ใส่ password แล้วถ้าเข้าได้ = สำเร็จ
\q
```

> ⚠️ ถ้า connection ไม่ได้ ให้แก้ `/etc/postgresql/*/main/pg_hba.conf`
> เปลี่ยน `peer` เป็น `md5` ในบรรทัด local แล้ว `sudo systemctl restart postgresql`

---

## Phase 2: Clone + Setup Project

### 2.1 สร้าง Directory + Clone
```bash
sudo mkdir -p /var/www/songkran-online
sudo chown $USER:$USER /var/www/songkran-online
git clone git@github.com:Freelance-Project-Team/songkran-online.git /var/www/songkran-online
```

> ⚠️ ถ้ายังไม่มี SSH key บน server:
> ```bash
> ssh-keygen -t ed25519 -C "lightnode-deploy"
> cat ~/.ssh/id_ed25519.pub
> # เอา public key ไปเพิ่มใน GitHub: Settings > Deploy Keys
> ```

### 2.2 สร้าง `.env` บน Server
```bash
nano /var/www/songkran-online/songkran-online-api/.env
```

```env
# ─── Server ───────────────────────────────────────────────────
NODE_ENV=production
PORT=4000

# ─── Frontend URL (CORS) ─────────────────────────────────────
CLIENT_URL=https://songkran-aotsvb.continue-labs.com

# ─── Database ─────────────────────────────────────────────────
DATABASE_URL=postgresql://songkran_user:<STRONG_PASSWORD>@localhost:5432/songkran-online

# ─── JWT (สร้างใหม่ด้วย: openssl rand -base64 32) ────────────
JWT_SECRET=<GENERATED_SECRET>
JWT_EXPIRES_IN=7d

# ─── Session ─────────────────────────────────────────────────
SESSION_SECRET=<GENERATED_SECRET>

# ─── Google OAuth ─────────────────────────────────────────────
GOOGLE_CLIENT_ID=<REAL_VALUE>
GOOGLE_CLIENT_SECRET=<REAL_VALUE>
GOOGLE_REDIRECT_URI=https://api-songkran-aotsvb.continue-labs.com/auth/google/callback

# ─── LINE OAuth ───────────────────────────────────────────────
LINE_CLIENT_ID=<REAL_VALUE>
LINE_CLIENT_SECRET=<REAL_VALUE>
LINE_REDIRECT_URI=https://api-songkran-aotsvb.continue-labs.com/auth/line/callback

# ─── Facebook OAuth ───────────────────────────────────────────
FACEBOOK_CLIENT_ID=<REAL_VALUE>
FACEBOOK_CLIENT_SECRET=<REAL_VALUE>
FACEBOOK_REDIRECT_URI=https://api-songkran-aotsvb.continue-labs.com/auth/facebook/callback
```

### 2.3 สร้าง JWT + Session secrets
```bash
openssl rand -base64 32    # ใช้สำหรับ JWT_SECRET
openssl rand -base64 32    # ใช้สำหรับ SESSION_SECRET
```

---

## Phase 3: Build + Start Backend

```bash
cd /var/www/songkran-online/songkran-online-api

# 1. Install dependencies
npm ci

# 2. Generate Prisma Client
npx prisma generate --schema src/shared/prisma/schema.prisma

# 3. สร้าง Initial Migration + Apply to DB
npx prisma migrate dev --schema src/shared/prisma/schema.prisma --name init

# 4. Build TypeScript → dist/
npm run build

# 5. ทดสอบ run ก่อน (Ctrl+C เพื่อหยุด)
node dist/server.js
# ควรเห็น: 🚀 Server is running on port 4000

# 6. Start ด้วย PM2
cd /var/www/songkran-online
pm2 start ecosystem.config.js

# 7. ดูสถานะ
pm2 status
pm2 logs songkran-api

# 8. ตั้ง PM2 auto-start เมื่อ reboot
pm2 save
pm2 startup
# (ทำตาม command ที่มันแสดงขึ้นมา)
```

ทดสอบ local:
```bash
curl http://localhost:4000/health
# ควรได้ JSON กลับมา: { "status": "ok", ... }
```

---

## Phase 4: DNS Setup

เข้า DNS Panel ของ `continue-labs.com` แล้วเพิ่ม:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `api-songkran-aotsvb` | `<LIGHTNODE_IP>` | 300 |

รอ DNS propagate (~5 นาที) แล้วทดสอบ:
```bash
dig api-songkran-aotsvb.continue-labs.com
# ควรเห็น IP ของ Lightnode
```

---

## Phase 5: Nginx + SSL

### 5.1 สร้าง Nginx config (HTTP ก่อน)
```bash
sudo nano /etc/nginx/sites-available/songkran-api
```

```nginx
server {
    listen 80;
    server_name api-songkran-aotsvb.continue-labs.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.2 Enable + Test
```bash
sudo ln -sf /etc/nginx/sites-available/songkran-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5.3 ขอ SSL Certificate
```bash
sudo mkdir -p /var/www/certbot
sudo certbot --nginx -d api-songkran-aotsvb.continue-labs.com
# เลือก: redirect HTTP to HTTPS (option 2)
```

### 5.4 ทดสอบ SSL auto-renew
```bash
sudo certbot renew --dry-run
```

### 5.5 ทดสอบว่าทุกอย่างทำงาน
```bash
curl https://api-songkran-aotsvb.continue-labs.com/health
```

เปิด Browser:
```
https://api-songkran-aotsvb.continue-labs.com/docs
```

---

## Phase 6: Firewall (แนะนำ)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

> ❌ **ไม่ต้อง** เปิด port 4000 จากภายนอก — Nginx จะ proxy ให้อยู่แล้ว

---

## การ Deploy ครั้งถัดไป (Re-deploy)

หลังจาก setup เสร็จแล้ว ครั้งต่อไปแค่ run:
```bash
cd /var/www/songkran-online
bash deploy.sh
```

หรือทำ manual:
```bash
cd /var/www/songkran-online
git pull origin main
cd songkran-online-api
npm ci
npx prisma generate --schema src/shared/prisma/schema.prisma
npx prisma migrate deploy --schema src/shared/prisma/schema.prisma
npm run build
cd ..
pm2 reload ecosystem.config.js
```

---

## Troubleshooting

### PM2 ไม่ start
```bash
pm2 logs songkran-api --lines 50
# ดู error message
```

### DB connection failed
```bash
# ทดสอบ connection ตรงๆ
psql -U songkran_user -d songkran-online -h localhost

# ถ้า auth failed ให้แก้ pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf
# เปลี่ยน local all all peer → local all all md5
sudo systemctl restart postgresql
```

### Nginx 502 Bad Gateway
```bash
# เช็คว่า backend run อยู่มั้ย
pm2 status
curl http://localhost:4000/health

# ดู Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### SSL cert หมดอายุ
```bash
sudo certbot renew
sudo systemctl reload nginx
```

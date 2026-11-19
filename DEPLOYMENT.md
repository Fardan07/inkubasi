# Panduan Deployment — CLARIQ AI Contract Platform (Cek Kontrak)

Dokumen ini berisi panduan langkah demi langkah untuk men-deploy **Backend (Node.js / Express + Prisma Neon PostgreSQL)** dan **Frontend (React 19 + Vite)** ke lingkungan production, lengkap dengan daftar Environment Variables, konfigurasi routing API, akun demo, serta prosedur verifikasi pasca-rilis.

---

## 1. Arsitektur Singkat

- **Backend (`backend/`)**: Node.js (ESM), Express.js, Prisma ORM (`@prisma/client`), `pdf-parse` (ekstraksi teks PDF), `jsonwebtoken` (autentikasi JWT 24 jam), dan `bcryptjs`.
- **Database**: Neon Serverless PostgreSQL (dikonfigurasi melalui `backend/prisma/schema.prisma`). Memiliki *In-Memory Fallback* otomatis jika `DATABASE_URL` tidak tersedia.
- **Frontend (`frontend/`)**: React 19, TypeScript, Tailwind CSS v4, Vite. Seluruh request API frontend memanggil path relatif `/api/*`.

---

## 2. Daftar Environment Variables

### A. Backend (`backend/.env`)

| Nama Variabel | Status | Nilai Default (Fallback) | Keterangan |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **WAJIB (Production)** | *In-Memory Store* | Connection string PostgreSQL (Neon DB) dengan `?sslmode=require`. Wajib diisi di production agar data user, kontrak, tanggal penting, dan status langganan (`HRD Pro`) tersimpan permanen. |
| `JWT_SECRET` | **WAJIB (Production)** | `clariq-super-secret-key-2026` | Secret key untuk menandatangani token JWT (masa aktif 24 jam). Wajib diganti dengan string acak minimal 32 karakter di production. |
| `PORT` | **Opsional** | `5000` | Port HTTP server Express. Platform seperti Render/Railway akan menyuntikkan variabel `PORT` secara otomatis. |
| `NODE_ENV` | **Opsional** | `development` | Set ke `production` saat deploy. |
| `GEMINI_API_KEY` | **Opsional** | *Tidak ada (Deterministic Engine)* | **Tidak wajib.** Endpoint analisis (`POST /api/contracts` & `POST /api/contract-check/analyze`) secara aktif menggunakan engine deterministik `simulateAiAnalysis()` yang bebas kuota dan zero-hallucination. |

Contoh `backend/.env` untuk production:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET="ganti_dengan_secret_acak_minimal_32_karakter_production"
DATABASE_URL="postgresql://user:password@ep-namahost.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### B. Frontend (`frontend/`) & Konfigurasi `VITE_API_URL` / Proxy

Di dalam kode `frontend/src/App.tsx`, seluruh pemanggilan ke backend menggunakan **path relatif `/api/...`** (contoh: `fetch("/api/contracts")`, `fetch("/api/auth/login")`).

- **Saat Development Lokal**: Vite Dev Server (`frontend/vite.config.js`) meneruskan `/api` ke `http://localhost:5000`.
- **Saat Deploy Production (2 Opsi)**:
  1. **Opsi 1 — Reverse Proxy / Rewrite Rules (Direkomendasikan tanpa ubah kode)**:
     - **Vercel (`frontend/vercel.json`)**:
       ```json
       {
         "rewrites": [
           {
             "source": "/api/:path*",
             "destination": "https://api-clariq-anda.onrender.com/api/:path*"
           }
         ]
       }
       ```
     - **Netlify (`frontend/public/_redirects`)**:
       ```text
       /api/*  https://api-clariq-anda.onrender.com/api/:splat  200
       /*      /index.html                                      200
       ```
     - **Nginx (VPS)**:
       ```nginx
       location /api/ {
           proxy_pass http://127.0.0.1:5000/api/;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           client_max_body_size 25M;
       }
       ```
  2. **Opsi 2 — Menggunakan `VITE_API_URL` di `vite.config.js`**:
     Jika Anda menggunakan proxy Vite Preview atau environment variable build-time:
     ```env
     VITE_API_URL="https://api-clariq-anda.onrender.com"
     ```

---

## 3. Langkah Deploy Backend (Node.js / Express + Neon PostgreSQL)

1. **Masuk ke direktori backend & instal dependensi**:
   ```bash
   cd backend
   npm ci
   ```
2. **Generate Prisma Client & sinkronkan skema ke Neon PostgreSQL**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   > **Catatan Skema**: Seluruh 4 tabel (`User`, `Contract`, `Clause`, `ImportantDate`) termasuk kolom `plan` (`"Free"` / `"HRD Pro"`) pada tabel `User` akan otomatis dibuat/disinkronkan oleh `prisma db push`.
3. **Jalankan server production**:
   ```bash
   npm start
   ```
   - Build Command (Render / Railway): `npm install && npx prisma generate && npx prisma db push`
   - Start Command: `npm start` (menjalankan `node src/index.js`)
   - Saat pertama kali menyala dan terhubung ke Neon PostgreSQL, server otomatis melakukan **auto-seeding** akun demo beserta 4 kontrak awal dan agenda tanggal penting jika tabel masih kosong.

---

## 4. Langkah Deploy Frontend (Vite Build)

1. **Masuk ke direktori frontend & instal dependensi**:
   ```bash
   cd frontend
   npm ci
   ```
2. **Verifikasi TypeScript & jalankan build production**:
   ```bash
   npm run typecheck
   npm run build
   ```
3. **Deploy folder output**:
   - Output statis berada di `frontend/dist/`.
   - Pasang aturan rewrite `/api/*` ke URL backend Anda (lihat Bagian 2.B di atas) serta fallback SPA `/* -> /index.html`.

---

## 5. Kredensial Akun Demo & Kode Promo Pameran

Akun demo otomatis di-seed ke database saat backend dijalankan pertama kali:

- **Nama**: `Putri Anindya`
- **Email**: `putri.anindya@gmail.com`
- **Password**: `password123`
- **Paket Awal**: `Free`
- **Kode Promo Upgrade Gratis (100% Diskon ke HRD Pro di Modal Checkout QRIS)**:
  - `PAMERAN`
  - `GURU`
  - `DOSEN`
  - `DEMO`

---

## 6. Cara Test Cepat Setelah Live (Post-Deployment Smoke Test)

Setelah backend dan frontend live, jalankan 4 pemeriksaan cepat berikut:

### 1. Cek Koneksi Server & Database (`GET /api/health`)
```bash
curl -s https://<domain-anda>/api/health
```
Pastikan respons JSON mengembalikan `"status": "ok"` dan `"database": "Neon PostgreSQL Connected"`.

### 2. Test Login Akun Demo & Token JWT 24 Jam (`POST /api/auth/login`)
```bash
curl -s -X POST https://<domain-anda>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"putri.anindya@gmail.com","password":"password123"}'
```
Pastikan mengembalikan `"success": true` beserta `token` JWT.

### 3. Test Analisis Kontrak AI (`POST /api/contract-check/analyze`)
```bash
curl -s -X POST https://<domain-anda>/api/contract-check/analyze \
  -H "Content-Type: application/json" \
  -d '{"contractType":"kerja","useSample":true}'
```
Pastikan mengembalikan `"success": true`, `riskScore`, `summary`, dan `aiClauses`.

### 4. Jalankan Automated Test Suite dari Lokal (Opsional)
Anda juga dapat menjalankan test suite lengkap di repositori:
```bash
# Test integritas frontend (32 checks)
node frontend/test-frontend.mjs

# Test seluruh endpoint backend (182 assertions, pastikan server lokal menyala di port 5000)
npm --prefix backend run test
```

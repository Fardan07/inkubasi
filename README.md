# CLARIQ AI Contract Platform (Fullstack Project)

Platform analisis dan penelaahan kontrak hukum cerdas berbasis AI dengan grounding hukum Indonesia (UU Ketenagakerjaan & Hukum Sewa Menyewa). Proyek fullstack ini mengintegrasikan **Frontend (React 19 + TypeScript + Vite + Tailwind CSS v4)** dan **Backend (Express.js + Prisma ORM + Neon PostgreSQL)**.

---

## ⚡ Cara Cepat Menjalankan (1 Perintah)

Cukup buka terminal di folder **`framework`** lalu jalankan:

```bash
# 1. Install semua dependensi (root, backend, dan frontend)
npm run install:all

# 2. Jalankan Backend & Frontend sekaligus
npm run dev
```

Kedua server akan aktif bersamaan di satu terminal:
- 🌐 **Frontend (UI Web)**: [http://localhost:3000](http://localhost:3000)
- 🔌 **Backend API**: [http://localhost:5000](http://localhost:5000)
- 🩺 **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Akun Demo Bawaan

Database telah otomatis terisi data awal (*auto-seeded*). Anda dapat langsung login atau mendaftar akun baru:
- **Email**: `putri.anindya@gmail.com`
- **Kata Sandi**: `password123`

---

## 🛠️ Tech Stack & Arsitektur

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS v4 | UI modern, bilingual (ID/EN), dark/light accents, micro-animations |
| **Backend** | Node.js (ES Module), Express.js | REST API, CORS, JSON Body Parser (limit 25MB) |
| **Database & ORM** | Neon Serverless PostgreSQL, Prisma ORM 6 | Database cloud aktif, relasi tabel User, Contract, Clause, ImportantDate |
| **Security** | JWT (JSON Web Token), bcryptjs | Hash kata sandi terenkripsi aman & proteksi token |
| **Dev Tools** | Concurrently | Menjalankan backend & frontend bersamaan |

---

## 📁 Struktur Direktori

```text
framework/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Skema database PostgreSQL (User, Contract, Clause, ImportantDate)
│   ├── src/
│   │   ├── index.js              # Server REST API Express (Port 5000)
│   │   ├── db.js                 # Inisialisasi Prisma Client & Auto-Seed Database
│   │   ├── seedData.js           # Data kontrak, pasal, dan tanggal awal
│   │   └── contractAnalyzer.js   # Mesin analisis AI & Grounding Hukum Indonesia
│   ├── .env                      # Variabel lingkungan (DATABASE_URL Neon, JWT_SECRET, PORT)
│   ├── .env.example              # Template variabel lingkungan
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Komponen utama aplikasi & routing navigasi
│   │   ├── i18n.ts               # Kamus translasi dwi-bahasa (Indonesia & Inggris)
│   │   ├── index.css             # Style sistem, Tailwind CSS v4 (@theme & styling)
│   │   └── main.tsx              # Entry point React
│   ├── index.html                # Dokumen HTML utama
│   ├── vite.config.js            # Konfigurasi Vite & proxy otomatis /api ke port 5000
│   └── package.json
│
├── .vscode/                      # Konfigurasi editor (CSS unknownAtRules)
├── package.json                  # Script gabungan (dev, install:all, build)
└── README.md                     # Dokumentasi proyek
```

---

## 📋 Fitur Utama Aplikasi

1. **Dashboard & Statistik Realtime**:
   - Ringkasan total dokumen, indikator kontrak *Needs Attention*, *In Review*, dan *Safe*.
   - Agenda tenggat waktu terdekat dan kuota penelaahan akun.
2. **Manajemen Kontrak & Klausul**:
   - Pencarian kontrak instan dan filter berdasarkan tingkat risiko.
   - Analisis klausul pasal penting (*Payment*, *Termination*, *Renewal*, *Confidentiality*, dsb).
3. **Analisis AI Cek Kontrak (Grounding Hukum Indonesia)**:
   - Evaluasi risiko kepatuhan hukum kerja (UU No. 13/2003, PP 35/2021, Putusan MK) dan sewa menyewa (KUHPerdata).
4. **AI Chat Asisten Kontrak**:
   - Tanya jawab interaktif mengenai hak & kewajiban pasal dalam kontrak.
5. **Bandingkan Kontrak (Contract Comparison)**:
   - Komparasi side-by-side antara draf lama dan draf revisi.
6. **Agenda & Pengingat Tenggat Waktu**:
   - Kalender tenggat waktu dan saklar (*toggle*) pengingat yang tersinkronisasi ke PostgreSQL.
7. **Dukungan Dwi-Bahasa (Bilingual)**:
   - Beralih bahasa secara instan antara Bahasa Indonesia (ID) dan Bahasa Inggris (EN).

---

## 📡 Daftar REST API Endpoints

### 1. Autentikasi & Akun
- `POST /api/auth/register` — Pendaftaran akun pengguna baru.
- `POST /api/auth/login` — Masuk dan mendapatkan JWT token.
- `GET /api/auth/me` — Memverifikasi token pengguna aktif.
- `GET /api/user` — Mengambil data profil dan pengaturan pengingat.
- `PUT /api/user` — Memperbarui profil dan preferensi akun di database.

### 2. Kontrak & Klausul
- `GET /api/contracts` — Mengambil semua kontrak (dukungan query `?search=` dan `?filter=`).
- `GET /api/contracts/:id` — Mengambil detail kontrak beserta seluruh klausul pasalnya.
- `POST /api/contracts` — Unggah dan analisis dokumen/teks kontrak baru (tersimpan ke database).
- `DELETE /api/contracts/:id` — Menghapus kontrak dari database.
- `GET /api/contracts/compare` — Mengambil data perbandingan versi draf kontrak.

### 3. AI Tanya Jawab (Chat)
- `POST /api/chat` atau `POST /api/contracts/:id/chat` — Mengajukan pertanyaan seputar isi kontrak ke AI.

### 4. Agenda & Pengingat
- `GET /api/dates` — Mengambil daftar agenda tanggal penting dari database.
- `PUT /api/dates/:id/reminder` — Mengaktifkan/menonaktifkan status pengingat di database.

### 5. Sistem & Statistik
- `GET /api/stats` — Mengambil agregat statistik kontrak dan agenda dari database.
- `GET /api/health` — Status kesehatan server dan status koneksi Neon PostgreSQL.

---

## 🗄️ Perintah Bantuan Database (Prisma)

Jika ingin memodifikasi model database di [backend/prisma/schema.prisma](file:///c:/Users/mafrd/.gemini/antigravity-ide/scratch/framework/backend/prisma/schema.prisma):

```bash
# Sinkronkan perubahan skema ke Neon PostgreSQL
cd backend
npx prisma db push

# Buka GUI Database Studio di browser
npx prisma studio
```

# Framework Fullstack Project (Node.js)

Struktur proyek Node.js Fullstack yang memisahkan arsitektur **Backend (Express.js)** dan **Frontend (Vite)** ke dalam foldernya masing-masing.

---

## 📁 Struktur Direktori

```text
framework/
├── backend/
│   ├── src/
│   │   └── index.js          # REST API Server (Express.js, port 5000)
│   ├── .env                  # Konfigurasi Environment (Port, Mode)
│   ├── .gitignore
│   └── package.json          # Dependencies backend (express, cors, dotenv)
│
├── frontend/
│   ├── src/
│   │   ├── main.js           # Logika interaktif & fetch ke API backend
│   │   └── style.css         # Styling modern & responsif (Vanilla CSS)
│   ├── index.html            # Tampilan web utama
│   ├── vite.config.js        # Konfigurasi Vite & proxy ke backend (/api)
│   ├── .gitignore
│   └── package.json          # Vite build tool
│
├── .gitignore
├── package.json              # Script bantuan root
└── README.md
```

---

## 🚀 Panduan Menjalankan Proyek

### 1. Instalasi Dependensi

Buka terminal dan jalankan instalasi pada masing-masing folder:

#### Untuk Backend:
```bash
cd backend
npm install
```

#### Untuk Frontend:
```bash
cd frontend
npm install
```

*(Atau dari folder root `framework`, Anda dapat menjalankan: `npm run install:all`)*

---

### 2. Menjalankan Server

Disarankan membuka **2 tab / jendela terminal terpisah**:

#### Terminal 1 — Menjalankan Backend:
```bash
cd backend
npm run dev
```
> Server backend akan aktif di: **`http://localhost:5000`**  
> Uji endpoint health check di: **`http://localhost:5000/api/health`**

#### Terminal 2 — Menjalankan Frontend:
```bash
cd frontend
npm run dev
```
> Aplikasi frontend Vite akan aktif di: **`http://localhost:3000`**

Buka browser Anda dan akses **`http://localhost:3000`** untuk melihat dashboard serta mencoba komunikasi langsung antara frontend dan backend.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store for demonstration
let tasks = [
  { id: 1, title: 'Inisialisasi Project Framework', completed: true, timestamp: new Date().toISOString() },
  { id: 2, title: 'Koneksikan Frontend (Vite) ke Backend (Express)', completed: true, timestamp: new Date().toISOString() },
  { id: 3, title: 'Kembangkan Fitur Aplikasi Anda', completed: false, timestamp: new Date().toISOString() }
];

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Backend Express.js Server berjalan dengan baik! 🚀',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      tasks: 'GET /api/tasks',
      addTask: 'POST /api/tasks'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: `${Math.floor(process.uptime())} detik`,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
});

app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: tasks,
    total: tasks.length
  });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Judul task (title) wajib diisi!'
    });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title: title.trim(),
    completed: false,
    timestamp: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json({
    success: true,
    message: 'Task berhasil ditambahkan!',
    data: newTask
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const index = tasks.findIndex(t => t.id === taskId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task tidak ditemukan'
    });
  }

  const deleted = tasks.splice(index, 1);
  res.json({
    success: true,
    message: 'Task berhasil dihapus',
    data: deleted[0]
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} tidak ditemukan di server ini.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada internal server.'
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Express Backend Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

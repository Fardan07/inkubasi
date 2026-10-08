// API Base URL - works both with Vite proxy (/api) and direct fallback
const API_URL = '/api';

// DOM Elements
const backendStatusIndicator = document.getElementById('backend-status-indicator');
const backendStatusText = document.getElementById('backend-status-text');
const refreshStatusBtn = document.getElementById('refresh-status-btn');
const reloadTasksBtn = document.getElementById('reload-tasks-btn');
const addTaskForm = document.getElementById('add-task-form');
const taskTitleInput = document.getElementById('task-title-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks-list');
const tasksCounter = document.getElementById('tasks-counter');
const messageBox = document.getElementById('api-message-box');

// Helper to show message box
function showMessage(msg, isError = false) {
  messageBox.textContent = msg;
  messageBox.className = `message-box ${isError ? 'error' : 'success'}`;
  setTimeout(() => {
    messageBox.className = 'message-box hidden';
  }, 4000);
}

// Check Backend Health
async function checkBackendHealth() {
  backendStatusText.textContent = 'Memeriksa Backend...';
  backendStatusIndicator.className = 'status-indicator';

  try {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();

    backendStatusIndicator.className = 'status-indicator online';
    backendStatusText.textContent = `Backend Terhubung (${data.uptime || 'OK'})`;
    return true;
  } catch (error) {
    console.warn('Backend tidak dapat dihubungi:', error);
    backendStatusIndicator.className = 'status-indicator offline';
    backendStatusText.textContent = 'Backend Offline (Port 5000)';
    return false;
  }
}

// Fetch Tasks from Backend
async function fetchTasks() {
  try {
    tasksList.innerHTML = '<li class="loading-state">Memuat data task...</li>';
    const res = await fetch(`${API_URL}/tasks`);
    
    if (!res.ok) {
      throw new Error(`Gagal memuat task (${res.status})`);
    }

    const result = await res.json();
    renderTasks(result.data || []);
  } catch (error) {
    console.error('Error fetchTasks:', error);
    tasksList.innerHTML = `
      <li class="loading-state" style="color: var(--rose);">
        ⚠️ Backend belum berjalan atau terjadi error.<br>
        <small style="color: var(--text-dim);">Jalankan backend dengan 'npm run dev' di folder framework/backend</small>
      </li>
    `;
    tasksCounter.textContent = '0 item';
  }
}

// Render Tasks to DOM
function renderTasks(tasks) {
  tasksCounter.textContent = `${tasks.length} item`;

  if (tasks.length === 0) {
    tasksList.innerHTML = `
      <li class="loading-state">Belum ada task. Tambahkan task baru di atas! ✨</li>
    `;
    return;
  }

  tasksList.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <div class="task-content">
        <span class="task-id">#${task.id}</span>
        <span class="task-title">${escapeHtml(task.title)}</span>
      </div>
      <button class="btn-danger-icon" title="Hapus task" data-id="${task.id}">🗑️</button>
    `;

    // Delete event listener
    const deleteBtn = li.querySelector('.btn-danger-icon');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    tasksList.appendChild(li);
  });
}

// Add New Task
async function handleAddTask(e) {
  e.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) return;

  addTaskBtn.disabled = true;
  addTaskBtn.innerHTML = '<span>Menyimpan...</span>';

  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Gagal menambahkan task');
    }

    taskTitleInput.value = '';
    showMessage('Task berhasil ditambahkan ke Backend!', false);
    await fetchTasks();
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    addTaskBtn.disabled = false;
    addTaskBtn.innerHTML = '<span>+ Tambah Task</span>';
  }
}

// Delete Task
async function deleteTask(id) {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE'
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Gagal menghapus task');
    }

    showMessage('Task berhasil dihapus!', false);
    await fetchTasks();
  } catch (error) {
    showMessage(error.message, true);
  }
}

// XSS Sanitizer
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Event Listeners
refreshStatusBtn.addEventListener('click', async () => {
  await checkBackendHealth();
  await fetchTasks();
});

reloadTasksBtn.addEventListener('click', fetchTasks);
addTaskForm.addEventListener('submit', handleAddTask);

// Initial Load
(async () => {
  await checkBackendHealth();
  await fetchTasks();
})();

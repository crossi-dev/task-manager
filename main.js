let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

const taskList      = document.getElementById('taskList');
const taskInput     = document.getElementById('taskInput');
const taskForm      = document.getElementById('taskForm');
const taskCount     = document.getElementById('taskCount');
const completedCount = document.getElementById('completedCount');
const clearBtn      = document.getElementById('clearCompleted');

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getFiltered() {
  if (filter === 'active')    return tasks.filter(t => !t.done);
  if (filter === 'completed') return tasks.filter(t => t.done);
  return tasks;
}

function render() {
  const filtered = getFiltered();
  const remaining = tasks.filter(t => !t.done).length;
  const completed = tasks.filter(t => t.done).length;

  taskCount.textContent = `${remaining} remaining`;
  completedCount.textContent = `${completed} completed`;

  taskList.innerHTML = '';

  if (filtered.length === 0) {
    taskList.innerHTML = `<p class="empty">No tasks here.</p>`;
    return;
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item${task.done ? ' completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="task-check" data-id="${task.id}">
        <svg viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9 10.5,3"/></svg>
      </div>
      <span class="task-text">${task.text}</span>
      <button class="task-delete" data-id="${task.id}">×</button>
    `;

    taskList.appendChild(li);
  });
}

// Add task
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  taskInput.value = '';
  save();
  render();
});

// Toggle / Delete
taskList.addEventListener('click', e => {
  const id = parseInt(e.target.closest('[data-id]')?.dataset.id);
  if (!id) return;

  if (e.target.closest('.task-check')) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    save();
    render();
  }

  if (e.target.closest('.task-delete')) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }
});

// Filters
document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

// Clear completed
clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
});

render();

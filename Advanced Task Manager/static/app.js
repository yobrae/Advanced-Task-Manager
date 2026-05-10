let tasks = [];

async function fetchTasks() {
  const res = await fetch('/tasks');
  tasks = await res.json();

  renderTasks(tasks);
}

function renderTasks(taskArray) {
  const list = document.getElementById("taskList");

  list.innerHTML = "";

  taskArray.forEach(task => {

    const li = document.createElement("li");

    li.draggable = true;

    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">
        ${task.text}
      </span>

      <button onclick="toggleTask(${task.id})">✔</button>
      <button onclick="editTask(${task.id})">✏</button>
      <button onclick="deleteTask(${task.id})">❌</button>
    `;

    addDragEvents(li);

    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");

  if (!input.value) return;

  await fetch('/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: input.value
    })
  });

  input.value = "";

  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`/delete/${id}`, {
    method: 'DELETE'
  });

  fetchTasks();
}

async function toggleTask(id) {
  await fetch(`/toggle/${id}`, {
    method: 'PUT'
  });

  fetchTasks();
}

async function editTask(id) {
  const text = prompt("Edit task");

  if (!text) return;

  await fetch(`/edit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  fetchTasks();
}

document.getElementById("search").addEventListener("input", e => {

  const value = e.target.value.toLowerCase();

  const filtered = tasks.filter(task =>
    task.text.toLowerCase().includes(value)
  );

  renderTasks(filtered);
});

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function addDragEvents(item) {

  item.addEventListener('dragstart', () => {
    item.classList.add('dragging');
  });

  item.addEventListener('dragend', () => {
    item.classList.remove('dragging');
  });
}

fetchTasks();
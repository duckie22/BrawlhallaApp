const API_URL = 'http://localhost:3000/tasks';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

// Fetch tasks from the backend
async function fetchTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  list.innerHTML = '';
  tasks.forEach(addTaskToDOM);
}

// Add a task to the DOM
function addTaskToDOM(task) {
  const listItem = document.createElement('li');
  listItem.textContent = task.text;

  if (task.completed) {
    listItem.classList.add('completed');
  }

  const completeButton = document.createElement('button');
  completeButton.textContent = '✔';
  completeButton.addEventListener('click', async () => {
    await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '✖';
  deleteButton.classList.add('delete');
  deleteButton.addEventListener('click', async () => {
    await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
    fetchTasks();
  });

  listItem.appendChild(completeButton);
  listItem.appendChild(deleteButton);
  list.appendChild(listItem);
}

// Handle form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  input.value = '';
  fetchTasks();
});

// Initial fetch
fetchTasks();
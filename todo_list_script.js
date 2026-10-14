// To-Do List with localStorage

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') {
    alert('Please type a task.');
    return;
  }
  tasks.push({ id: Date.now(), text: text, done: false });
  taskInput.value = '';
  save();
}

function toggleTask(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].done = !tasks[i].done;
    }
  }
  save();
}

function removeTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  save();
}

function clearDone() {
  tasks = tasks.filter(function (t) { return t.done === false; });
  save();
}

function setFilter(filter, button) {
  currentFilter = filter;
  const buttons = document.querySelectorAll('.filter');
  buttons.forEach(function (b) { b.classList.remove('active'); });
  button.classList.add('active');
  render();
}

function render() {
  taskList.innerHTML = '';

  let visible = tasks;

  if (currentFilter === 'active') {
    visible = tasks.filter(function (t) { return t.done === false; });
  } else if (currentFilter === 'done') {
    visible = tasks.filter(function (t) { return t.done === true; });
  }

  if (visible.length === 0) {
    taskList.innerHTML = '<li style="justify-content:center;color:#aaa;">No tasks here</li>';
  }

  visible.forEach(function (t) {
    const li = document.createElement('li');
    if (t.done) li.classList.add('done');

    li.innerHTML = `
      <input type="checkbox" ${t.done ? 'checked' : ''} />
      <span class="text">${t.text}</span>
      <button class="remove">×</button>
    `;

    li.querySelector('input').onclick = function () { toggleTask(t.id); };
    li.querySelector('.remove').onclick = function () { removeTask(t.id); };

    taskList.appendChild(li);
  });

  const activeCount = tasks.filter(function (t) { return !t.done; }).length;
  counter.textContent = activeCount + ' task(s) left';
}

taskInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTask();
});

render();

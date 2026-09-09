// Weekend To-Do List - script.js

let tasks = [];

// HTML elements
const todoForm   = document.getElementById("todoForm");
const taskInput  = document.getElementById("taskInput");
const errorMsg   = document.getElementById("errorMsg");
const taskList   = document.getElementById("taskList");
const emptyMsg   = document.getElementById("emptyMsg");
const clearAllBtn = document.getElementById("clearAllBtn");

const STORAGE_KEY = "weekendTodoTasks";

// A little checkmark icon used inside the round checkbox
const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none">
  <path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Local Storage
function saveTasksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    // Nothing saved yet - start with the sample checklist
    tasks = DEFAULT_TASKS;
    saveTasksToStorage();
  }
}

// Render
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " done" : "");

    // round checkbox button
    const check = document.createElement("button");
    check.type = "button";
    check.className = "check-circle";
    check.innerHTML = CHECK_SVG;
    check.setAttribute("aria-label", "Mark '" + task.text + "' as done");
    check.addEventListener("click", function () {
      toggleDone(task.id);
    });

    // task text
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    // delete button
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "task-delete";
    delBtn.textContent = "✕";
    delBtn.setAttribute("aria-label", "Delete '" + task.text + "'");
    delBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  emptyMsg.classList.toggle("show", tasks.length === 0);
}

// Create Task
function addTask(text) {
  const newTask = {
    id: Date.now(),
    text: text,
    done: false,
  };
  tasks.push(newTask);
  saveTasksToStorage();
  renderTasks();
}

// Update Task
function toggleDone(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) {
    task.done = !task.done;
    saveTasksToStorage();
    renderTasks();
  }
}

// Delete Single Task
function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasksToStorage();
  renderTasks();
}

// Delete
function clearAllTasksAsync() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      tasks = [];
      saveTasksToStorage();
      resolve();
    }, 2000); // 2 second loading delay
  });
}

async function handleClearAll() {
  if (tasks.length === 0) return;

  clearAllBtn.disabled = true;
  clearAllBtn.textContent = "Clearing...";

  await clearAllTasksAsync();

  clearAllBtn.disabled = false;
  clearAllBtn.textContent = "Clear All";
  renderTasks();
}


// Form Handling (create + validation)
todoForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const text = taskInput.value.trim();

  if (text === "") {
    errorMsg.textContent = "Please type a to-do before adding it.";
    return;
  }

  errorMsg.textContent = "";
  addTask(text);
  taskInput.value = "";
  taskInput.focus();
});

taskInput.addEventListener("input", function () {
  errorMsg.textContent = "";
});

clearAllBtn.addEventListener("click", handleClearAll);


loadTasksFromStorage();
renderTasks();

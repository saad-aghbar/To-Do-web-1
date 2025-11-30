// File: js/app.js
// Student: saad aghbar (12429711)
// Uses Fetch API to interact with the backend API.

/*
  API ENDPOINTS:

  Base URL:
    http://portal.almasar101.com/assignment/api

  1) Add task (POST)
     add.php?stdid=STUDENT_ID&key=API_KEY
     Body (JSON): { "title": "Task title" }

  2) Get tasks (GET)
     get.php?stdid=STUDENT_ID&key=API_KEY

  3) Delete task (GET or DELETE)
     delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
*/

// ---------- CONFIG ----------
const STUDENT_ID = "12429711";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "http://portal.almasar101.com/assignment/api";

// ---------- DOM ELEMENTS ----------
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

// ---------- STATUS HELPER ----------
function setStatus(message, isError = false) {
    statusDiv.textContent = message || "";
    statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

// ---------- RENDER ONE TASK ----------
function renderTask(task) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const delBtn = document.createElement("button");
    delBtn.className = "task-delete";
    delBtn.textContent = "Delete";

    // DELETE HANDLER
    delBtn.addEventListener("click", async () => {
        setStatus("Deleting task...");

        try {
            const url = `${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${task.id}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                li.remove();
                setStatus("Task deleted.");
            } else {
                setStatus("Failed to delete task.", true);
            }
        } catch (err) {
            setStatus("Error deleting task.", true);
        }
    });

    li.appendChild(title);
    li.appendChild(delBtn);
    list.appendChild(li);
}

// ---------- TODO 1: LOAD TASKS ----------
document.addEventListener("DOMContentLoaded", async () => {
    setStatus("Loading tasks...");

    try {
        const url = `${API_BASE}/get.php?stdid=${STUDENT_ID}&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        list.innerHTML = "";

        if (data.success && Array.isArray(data.tasks)) {
            if (data.tasks.length === 0) {
                setStatus("No tasks found.");
                return;
            }

            data.tasks.forEach(task => renderTask(task));
            setStatus("Tasks loaded.");
        } else {
            setStatus("No tasks found.");
        }
    } catch (err) {
        setStatus("Error loading tasks.", true);
    }
});

// ---------- TODO 2: ADD TASK ----------
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = input.value.trim();
    if (title === "") return;

    setStatus("Adding task...");

    try {
        const url = `${API_BASE}/add.php?stdid=${STUDENT_ID}&key=${API_KEY}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });

        const data = await response.json();

        if (data.success && data.task) {
            renderTask(data.task);
            input.value = "";
            setStatus("Task added.");
        } else {
            setStatus("Failed to add task.", true);
        }
    } catch (err) {
        setStatus("Error adding task.", true);
    }
});

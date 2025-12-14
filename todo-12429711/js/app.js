// File: js/app.js
// Student: saad aghbar (12429711)

const STUDENT_ID = "12429711";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// DOM elements
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

// Helper to show status messages
function setStatus(message, isError = false) {
    statusDiv.textContent = message || "";
    statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

// -------------------------------------------------------
// Render a single task
// -------------------------------------------------------
function renderTask(task) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const delBtn = document.createElement("button");
    delBtn.className = "task-delete";
    delBtn.textContent = "Delete";

    // DELETE HANDLER
    delBtn.addEventListener("click", async () => {
        setStatus("Deleting...");

        const url =
            `${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${task.id}`;

        try {
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error("Request failed");
            }

            const data = await res.json();

            if (data.success) {
                li.remove();
                setStatus("Task deleted.");
            } else {
                setStatus("Failed to delete task.", true);
            }
        } catch (error) {
            setStatus("Error deleting task.", true);
        }
    });

    actions.appendChild(delBtn);
    li.appendChild(title);
    li.appendChild(actions);
    list.appendChild(li);
}

// -------------------------------------------------------
// LOAD TASKS
// -------------------------------------------------------
async function loadTasks() {
    setStatus("Loading tasks...");

    const url =
        `${API_BASE}/get.php?stdid=${STUDENT_ID}&key=${API_KEY}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Request failed");
        }

        const data = await res.json();
        list.innerHTML = "";

        if (data.tasks && Array.isArray(data.tasks)) {
            data.tasks.forEach(task => renderTask(task));
        }

        setStatus("");
    } catch (error) {
        setStatus("Failed to load tasks.", true);
    }
}

// Load tasks on page open
document.addEventListener("DOMContentLoaded", loadTasks);

// -------------------------------------------------------
// ADD NEW TASK
// -------------------------------------------------------
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    setStatus("Adding task...");

    const url =
        `${API_BASE}/add.php?stdid=${STUDENT_ID}&key=${API_KEY}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });

        if (!res.ok) {
            throw new Error("Request failed");
        }

        const data = await res.json();

        if (data.task) {
            renderTask(data.task);
            input.value = "";
            setStatus("Task added.");
        } else {
            setStatus("Failed to add task.", true);
        }
    } catch (error) {
        setStatus("Error adding task.", true);
    }
});

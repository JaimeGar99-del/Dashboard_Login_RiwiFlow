// --- PÁGINA CREAR TAREA ---

import { getAllData, createTask } from "../api.js";
import { buildFormLayout } from "../shell.js";
import { INPUT_CLASS, BTN_PRIMARY, BTN_SECONDARY, FORM_CARD } from "../constants.js";
import { escHtml } from "../utils.js";
import { Toast } from "../components/toast.js";
import state from "../state.js";

export async function renderCreateTask() {
  const formArea = buildFormLayout("Create New Task", "Fill in details to add a new task to the board");

  if (!state.users.length) {
    const { users } = await getAllData();
    state.users = users;
  }

  formArea.innerHTML = `
    <div class="w-full max-w-[520px]">
      <div class="${FORM_CARD}">
        <h3 class="font-title-sm text-title-sm text-on-surface">Task Details</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">New tasks are placed into the "To Do" column by default.</p>
        <div class="border-t border-outline-variant"></div>
        <form id="createTaskForm" class="space-y-lg">
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Title</label>
            <input id="taskTitle" type="text" placeholder="e.g., Design login screen" required class="${INPUT_CLASS}" />
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Description</label>
            <textarea id="taskDesc" rows="3" placeholder="Describe the task details..." class="${INPUT_CLASS} resize-none"></textarea>
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Assign to</label>
            <select id="taskAssignee" class="${INPUT_CLASS}">
              ${state.users.map(u => `<option value="${u.id}">${escHtml(u.name)} (${u.role})</option>`).join("")}
            </select>
          </div>
          <div class="border-t border-outline-variant"></div>
          <div class="flex gap-md justify-end">
            <button type="button" id="cancelTaskBtn" class="${BTN_SECONDARY}">Cancel</button>
            <button type="submit" class="${BTN_PRIMARY}">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("cancelTaskBtn").addEventListener("click", () => window.location.hash = "#dashboard");
  document.getElementById("createTaskForm").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.target.querySelector("[type=submit]");
    btn.disabled = true;
    btn.textContent = "Creating...";
    try {
      await createTask({
        title: document.getElementById("taskTitle").value.trim(),
        description: document.getElementById("taskDesc").value.trim(),
        status: "todo",
        userId: document.getElementById("taskAssignee").value,
      });
      Toast.show("Task created successfully.", "success");
      window.location.hash = "#dashboard";
    } catch (err) {
      Toast.show(err.message, "error");
      btn.disabled = false;
      btn.textContent = "Create Task";
    }
  });
}

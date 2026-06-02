// --- EDIT TASK PAGE ---

import { getTaskById, getAllData, updateTask } from "../api.js";
import { buildFormLayout } from "../shell.js";
import { INPUT_CLASS, BTN_PRIMARY, BTN_SECONDARY, FORM_CARD } from "../constants.js";
import { escHtml } from "../utils.js";
import { Toast } from "../components/toast.js";
import state from "../state.js";

export async function renderEditTask(id) {
  const task = await getTaskById(id);

  if (!state.users.length) {
    const { users } = await getAllData();
    state.users = users;
  }

  if (!task) return window.location.hash = "#dashboard";

  const isOwner = String(task.userId) === String(state.currentUser.id);
  const isAdmin = state.currentUser.role === "admin";
  if (!isAdmin && !isOwner) {
    Toast.show("You do not have permission to edit this task.", "error");
    window.location.hash = "#dashboard";
    return;
  }

  const formArea = buildFormLayout("Edit Task", "Update task attributes below");
  formArea.innerHTML = `
    <div class="w-full max-w-[520px]">
      <div class="${FORM_CARD}">
        <h3 class="font-title-sm text-title-sm text-on-surface">Task Information</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${isAdmin ? "You have full access as admin." : "You can only edit description and status."}</p>
        <div class="border-t border-outline-variant"></div>
        <form id="editTaskForm" class="space-y-lg">
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Title</label>
            <input id="taskTitle" type="text" value="${escHtml(task.title)}" ${!isAdmin ? "disabled" : ""} required class="${INPUT_CLASS}" />
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Description</label>
            <textarea id="taskDesc" rows="4" class="${INPUT_CLASS} resize-none">${escHtml(task.description)}</textarea>
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Status</label>
            <select id="taskStatus" class="${INPUT_CLASS}">
              <option value="todo" ${task.status === "todo" ? "selected" : ""}>To Do</option>
              <option value="in progress" ${task.status === "in progress" ? "selected" : ""}>In Progress</option>
              <option value="in review" ${task.status === "in review" ? "selected" : ""}>In Review</option>
              <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
            </select>
          </div>
          ${isAdmin ? `
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Assign to</label>
            <select id="taskAssignee" class="${INPUT_CLASS}">
              ${state.users.map(u => `<option value="${u.id}" ${String(u.id) === String(task.userId) ? "selected" : ""}>${escHtml(u.name)} (${u.role})</option>`).join("")}
            </select>
          </div>` : ""}
          <div class="border-t border-outline-variant"></div>
          <div class="flex gap-md justify-end">
            <button type="button" id="cancelEditBtn" class="${BTN_SECONDARY}">Cancel</button>
            <button type="submit" class="${BTN_PRIMARY}">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("cancelEditBtn").addEventListener("click", () => window.location.hash = "#dashboard");
  document.getElementById("editTaskForm").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.target.querySelector("[type=submit]");
    btn.disabled = true;
    btn.textContent = "Saving...";
    const patch = { description: document.getElementById("taskDesc").value.trim(), status: document.getElementById("taskStatus").value };
    if (isAdmin) {
      patch.title = document.getElementById("taskTitle").value.trim();
      patch.userId = document.getElementById("taskAssignee").value;
    }
    try {
      await updateTask(id, patch);
      Toast.show("Task updated successfully.", "success");
      window.location.hash = "#dashboard";
    } catch (err) {
      Toast.show(err.message, "error");
      btn.disabled = false;
      btn.textContent = "Save Changes";
    }
  });
}
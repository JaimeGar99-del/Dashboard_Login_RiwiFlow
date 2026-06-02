// --- TASK CARD COMPONENT ---

import { deleteTask } from "../api.js";
import { escHtml, initials } from "../utils.js";
import { Toast } from "./toast.js";
import state from "../state.js";

const STATUS_STYLES = {
  "todo":        { badge: "bg-surface-container-high text-on-surface-variant", border: "" },
  "in progress": { badge: "bg-primary-fixed text-on-primary-fixed-variant",   border: "border-l-4 border-l-primary" },
  "in review":   { badge: "bg-primary-fixed text-on-primary-fixed-variant",   border: "" },
  "done":        { badge: "bg-secondary-container text-secondary",            border: "" },
};

export function TaskCard(task, usersList, currentUser, onDelete, onDragStart) {
  const assigned = task.user || usersList.find(u => String(u.id) === String(task.userId));
  const isOwner = String(task.userId) === String(currentUser.id);
  const isAdmin = currentUser.role === "admin";
  const canEdit = isAdmin || isOwner;
  const styles = STATUS_STYLES[task.status] || STATUS_STYLES["todo"];
  const isDone = task.status === "done";
  const isInProgress = task.status === "in progress";

  const card = document.createElement("div");
  card.className = `task-card bg-surface${isDone ? "/60" : ""} border border-outline-variant rounded-xl p-md shadow-sm ${isDone ? "opacity-80" : ""} ${isInProgress ? styles.border : ""} ${canEdit ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`;
  card.setAttribute("draggable", canEdit ? "true" : "false");
  card.innerHTML = `
    <div class="flex items-start justify-between mb-xs">
      <span class="${styles.badge} px-2 py-0.5 rounded-full font-label-sm text-label-sm">${escHtml(assigned?.role === "admin" ? "Ops" : "Engineering")}</span>
      ${isDone ? `<span class="material-symbols-outlined text-tertiary-container text-sm" style="font-variation-settings:'FILL' 1">check_circle</span>` : ""}
      ${isInProgress && task.priority === "high" ? `<span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings:'FILL' 1">star</span>` : ""}
    </div>
    <h4 class="font-label-md text-label-md text-on-surface mb-xs ${isDone ? "line-through" : ""}">${escHtml(task.title)}</h4>
    <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${escHtml(task.description)}</p>
    <div class="mt-md flex items-center justify-between">
      <div class="flex items-center gap-xs">
        <div class="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center border-2 border-surface">
          <span class="font-label-sm text-on-primary-fixed-variant text-[10px]">${initials(assigned?.name)}</span>
        </div>
        <span class="font-label-md text-label-md text-on-surface truncate text-[12px]">${escHtml(assigned?.name || "Unassigned")}</span>
      </div>
      <div class="flex items-center gap-xs opacity-0 group-hover:opacity-100 card-actions">
        ${canEdit ? `<button class="btn-edit text-primary font-label-sm text-label-sm hover:underline">Edit</button>` : ""}
        ${isAdmin ? `<button class="btn-delete material-symbols-outlined text-[18px] text-outline hover:text-error transition-colors">delete</button>` : ""}
      </div>
    </div>
  `;

  // Hover to show/hide action buttons
  const actionsEl = card.querySelector(".card-actions");
  if (actionsEl) {
    card.addEventListener("mouseenter", () => actionsEl.style.opacity = "1");
    card.addEventListener("mouseleave", () => actionsEl.style.opacity = "0");
  }

  card.addEventListener("dragstart", e => {
    if (!canEdit) { e.preventDefault(); return; }
    e.dataTransfer.effectAllowed = "move";
    onDragStart(task.id);
  });
  card.querySelector(".btn-edit")?.addEventListener("click", () => window.location.hash = `#edit-task?id=${task.id}`);
  card.querySelector(".btn-delete")?.addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(task.id);
      Toast.show("Task deleted successfully.", "success");
      state.tasks = state.tasks.filter(t => String(t.id) !== String(task.id));
      onDelete(true);
    } catch (err) {
      Toast.show(err.message, "error");
    }
  });
  return card;
}

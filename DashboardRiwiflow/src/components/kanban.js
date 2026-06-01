// --- KANBAN BOARD COMPONENT ---

import { updateTask } from "../api.js";
import { TaskCard } from "./taskCard.js";
import { Toast } from "./toast.js";

const COLUMNS = [
  { id: "todo",        label: "To Do",       counterClass: "bg-surface-container-high text-on-surface-variant" },
  { id: "in progress", label: "In Progress", counterClass: "bg-primary-container text-on-primary" },
  { id: "in review",   label: "In Review",   counterClass: "bg-surface-container-high text-on-surface-variant" },
  { id: "done",        label: "Done",        counterClass: "bg-surface-container-high text-on-surface-variant" },
];

export function KanbanBoard(taskList, userList, currentUser, onRefresh) {
  const board = document.createElement("div");
  board.className = "flex gap-gutter h-full";
  let draggedTaskId = null;
  const colLists = {};

  COLUMNS.forEach(({ id, label, counterClass }) => {
    const col = document.createElement("div");
    col.className = "kanban-column flex flex-col w-1/4 h-full";
    col.innerHTML = `
      <div class="flex items-center justify-between mb-md">
        <div class="flex items-center gap-2">
          <h3 class="font-title-sm text-title-sm text-on-surface">${label}</h3>
          <span class="col-counter ${counterClass} px-2 py-0.5 rounded-full font-label-sm text-label-sm">0</span>
        </div>
        <button class="material-symbols-outlined text-outline hover:text-on-surface transition-colors">more_horiz</button>
      </div>
      <div class="col-list flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar transition-colors duration-200"></div>
    `;
    const list = col.querySelector(".col-list");
    colLists[id] = { list, counter: col.querySelector(".col-counter") };

    list.addEventListener("dragover", e => {
      e.preventDefault();
      list.classList.add("bg-primary-fixed/30", "ring-2", "ring-primary");
    });
    list.addEventListener("dragleave", () => list.classList.remove("bg-primary-fixed/30", "ring-2", "ring-primary"));
    list.addEventListener("drop", async e => {
      e.preventDefault();
      list.classList.remove("bg-primary-fixed/30", "ring-2", "ring-primary");
      if (!draggedTaskId) return;

      const task = taskList.find(t => String(t.id) === String(draggedTaskId));
      if (!task || task.status === id) return;
      const canDrag = currentUser.role === "admin" || String(task.userId) === String(currentUser.id);

      if (!canDrag) {
        Toast.show("You do not have permission to move this task.", "error");
        return;
      }
      try {
        await updateTask(draggedTaskId, { status: id });
        Toast.show("Task moved successfully.", "success");
        onRefresh();
      } catch (err) {
        Toast.show(err.message, "error");
      }
    });
    board.appendChild(col);
  });

  const renderCards = (query = "") => {
    const q = query.toLowerCase().trim();
    COLUMNS.forEach(({ id }) => {
      const { list, counter } = colLists[id];
      list.innerHTML = "";
      const colTasks = taskList.filter(t => {
        if (t.status !== id) return false;
        if (!q) return true;
        const assigned = userList.find(u => String(u.id) === String(t.userId));
        return t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)) || (assigned && assigned.name.toLowerCase().includes(q));
      });
      counter.textContent = colTasks.length;
      colTasks.forEach(task => list.appendChild(TaskCard(task, userList, currentUser, onRefresh, id => draggedTaskId = id)));
      if (colTasks.length === 0 && q) {
        const empty = document.createElement("p");
        empty.className = "text-center text-on-surface-variant font-body-sm py-md text-xs opacity-60";
        empty.textContent = "No results";
        list.appendChild(empty);
      }
    });
  };

  renderCards();
  const searchInput = document.getElementById("globalSearch");
  if (searchInput) {
    const fresh = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(fresh, searchInput);
    fresh.addEventListener("input", e => renderCards(e.target.value));
  }
  return board;
}

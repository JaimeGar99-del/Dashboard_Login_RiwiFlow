// --- DASHBOARD PAGE (KANBAN BOARD) ---

import { getAllData } from "../api.js";
import { getOrBuildShell } from "../shell.js";
import { KanbanBoard } from "../components/kanban.js";
import state from "../state.js";

export async function renderDashboard(skipFetch = false) {
  const boardContainer = document.getElementById("boardContainer");
  if (skipFetch && boardContainer) {
    boardContainer.innerHTML = "";
    boardContainer.appendChild(KanbanBoard(state.tasks, state.users, state.currentUser, () => renderDashboard(true)));
    return;
  }

  const pageContent = getOrBuildShell();
  pageContent.innerHTML = `
    <div class="flex-1 flex flex-col px-gutter py-md overflow-hidden h-full">
      <div class="flex items-center justify-between mb-md shrink-0">
        <div>
          <h2 class="font-headline-md text-headline-md text-on-surface">Project Board</h2>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Drag cards between columns to update status</p>
        </div>
      </div>
      <div id="boardContainer" class="flex-1 overflow-hidden">
        <div class="flex items-center justify-center h-full text-on-surface-variant">
          <span class="material-symbols-outlined animate-spin mr-2">progress_activity</span>Loading board...
        </div>
      </div>
    </div>
  `;

  // Combined fetch: retrieves users and tasks in parallel
  const { users, tasks } = await getAllData();
  state.tasks = tasks;
  state.users = users;

  const newBoardContainer = document.getElementById("boardContainer");
  if (newBoardContainer) {
    newBoardContainer.innerHTML = "";
    newBoardContainer.appendChild(KanbanBoard(state.tasks, state.users, state.currentUser, () => renderDashboard(true)));
  }
}
// --- USER MANAGEMENT PAGE ---

import { getAllData, deleteTask, updateTask, deleteUser } from "../api.js";
import { getOrBuildShell } from "../shell.js";
import { BTN_PRIMARY } from "../constants.js";
import { escHtml, initials } from "../utils.js";
import { Toast } from "../components/toast.js";
import { ConfirmModal, showReassignModal } from "../components/modal.js";
import state from "../state.js";

export async function renderUsers() {
  const pageContent = getOrBuildShell();
  pageContent.innerHTML = `
    <div class="flex-1 flex flex-col px-gutter py-md overflow-auto">
      <div class="flex items-center justify-between mb-md shrink-0">
        <div>
          <h2 class="font-headline-md text-headline-md text-on-surface">User Management</h2>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Manage team members and credentials</p>
        </div>
        <button id="createUserBtn" class="${BTN_PRIMARY}">
          <span class="material-symbols-outlined text-[18px]">person_add</span>New User
        </button>
      </div>
      <div id="usersTableArea">
        <div class="flex items-center justify-center h-32 text-on-surface-variant">
          <span class="material-symbols-outlined animate-spin mr-2">progress_activity</span>Loading Users...
        </div>
      </div>
    </div>
  `;
  document.getElementById("createUserBtn").addEventListener("click", () => window.location.hash = "#create-user");

  // Combined fetch: retrieves users and tasks in parallel
  const { users: allUsers, tasks: allTasks } = await getAllData();
  state.users = allUsers;
  state.tasks = allTasks;

  const roleColors = role => role === "admin"
    ? "bg-primary-fixed text-on-primary-fixed-variant"
    : "bg-secondary-container text-on-secondary-fixed";

  const tableContainer = document.getElementById("usersTableArea");
  tableContainer.innerHTML = `
    <div class="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <table class="w-full">
        <thead class="bg-surface-container-low border-b border-outline-variant">
          <tr>
            <th class="text-left px-lg py-md font-label-md text-label-md text-on-surface-variant">Name</th>
            <th class="text-left px-lg py-md font-label-md text-label-md text-on-surface-variant">Email</th>
            <th class="text-left px-lg py-md font-label-md text-label-md text-on-surface-variant">Role</th>
            <th class="text-left px-lg py-md font-label-md text-label-md text-on-surface-variant">Tasks</th>
            <th class="text-right px-lg py-md font-label-md text-label-md text-on-surface-variant">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.users.map(u => {
            const isSelf = String(u.id) === String(state.currentUser.id);
            const taskCount = state.tasks.filter(t => String(t.userId) === String(u.id)).length;
            return `
              <tr class="border-b border-outline-variant last:border-0 hover:bg-surface-container-low/50 transition-colors">
                <td class="px-lg py-md">
                  <div class="flex items-center gap-sm">
                    <div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                      <span class="font-label-sm text-on-primary-fixed-variant text-xs">${initials(u.name)}</span>
                    </div>
                    <span class="font-label-md text-label-md text-on-surface">${escHtml(u.name)}</span>
                    ${isSelf ? `<span class="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm ml-sm">You</span>` : ""}
                  </div>
                </td>
                <td class="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">${escHtml(u.email)}</td>
                <td class="px-lg py-md">
                  <span class="px-2 py-0.5 rounded-full font-label-sm text-label-sm capitalize ${roleColors(u.role)}">${escHtml(u.role)}</span>
                </td>
                <td class="px-lg py-md">
                  ${taskCount > 0
                    ? `<span class="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant"><span class="material-symbols-outlined text-[14px]">task_alt</span>${taskCount} tarea${taskCount !== 1 ? "s" : ""}</span>`
                    : `<span class="font-label-sm text-label-sm text-outline">Sin tareas</span>`}
                </td>
                <td class="px-lg py-md text-right">
                  <div class="flex items-center justify-end gap-sm">
                    <button class="btn-edit-user flex items-center gap-xs text-primary font-label-sm text-label-sm hover:underline" data-id="${u.id}"><span class="material-symbols-outlined text-[16px]">edit</span>Edit</button>
                    ${!isSelf ? `<button class="btn-delete-user material-symbols-outlined text-[18px] text-outline hover:text-error transition-colors" data-id="${u.id}" data-name="${escHtml(u.name)}" data-tasks="${taskCount}">delete</button>` : ""}
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;

  // --- Events ---
  tableContainer.querySelectorAll(".btn-edit-user").forEach(btn =>
    btn.addEventListener("click", () => window.location.hash = `#edit-user?id=${btn.dataset.id}`)
  );

  tableContainer.querySelectorAll(".btn-delete-user").forEach(btn => {
    btn.addEventListener("click", async () => {
      const userId = btn.dataset.id;
      const userName = btn.dataset.name;
      const taskCount = parseInt(btn.dataset.tasks);
      const userTasks = state.tasks.filter(t => String(t.userId) === String(userId));

      if (taskCount > 0) {
        // User with tasks: modal with 3 options
        const otherUsers = state.users.filter(u => String(u.id) !== String(userId));

        await ConfirmModal({
          title: `Eliminar a ${userName}`,
          message: `Este usuario tiene ${taskCount} tarea${taskCount !== 1 ? "s" : ""} asignada${taskCount !== 1 ? "s" : ""}. ¿Qué deseas hacer con ellas?`,
          actions: [
            {
              label: "Eliminar tareas también",
              icon: "delete_forever",
              variant: "danger",
              onClick: async () => {
                try {
                  for (const t of userTasks) {
                    await deleteTask(t.id);
                  }
                  await deleteUser(userId);
                  Toast.show(`Usuario y ${taskCount} tarea${taskCount !== 1 ? "s" : ""} eliminados.`, "success");
                  await renderUsers();
                } catch (err) { Toast.show(err.message, "error"); }
              }
            },
            {
              label: "Reasignar tareas a otro usuario",
              icon: "swap_horiz",
              variant: otherUsers.length ? "primary" : "secondary",
              onClick: async () => {
                if (!otherUsers.length) {
                  Toast.show("No hay otros usuarios a quien reasignar.", "error");
                  return;
                }
                await showReassignModal(userId, userName, userTasks, otherUsers, renderUsers);
              }
            },
            {
              label: "Dejar tareas sin asignar",
              icon: "person_off",
              variant: "secondary",
              onClick: async () => {
                try {
                  for (const t of userTasks) {
                    await updateTask(t.id, { userId: null });
                  }
                  await deleteUser(userId);
                  Toast.show(`Usuario eliminado. ${taskCount} tarea${taskCount !== 1 ? "s" : ""} sin asignar.`, "success");
                  await renderUsers();
                } catch (err) { Toast.show(err.message, "error"); }
              }
            },
          ]
        });
      } else {
        // No tasks: simple confirmation
        await ConfirmModal({
          title: `Eliminar a ${userName}`,
          message: "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.",
          actions: [
            {
              label: "Eliminar usuario",
              icon: "delete",
              variant: "danger",
              onClick: async () => {
                try {
                  await deleteUser(userId);
                  Toast.show("Usuario eliminado correctamente.", "success");
                  await renderUsers();
                } catch (err) { Toast.show(err.message, "error"); }
              }
            },
            { label: "Cancelar", icon: "close", variant: "secondary", onClick: async () => {} }
          ]
        });
      }
    });
  });
}
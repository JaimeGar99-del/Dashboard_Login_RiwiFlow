// --- MODAL DE CONFIRMACIÓN REUTILIZABLE ---

import { escHtml } from "../utils.js";
import { INPUT_CLASS, BTN_PRIMARY, BTN_SECONDARY } from "../constants.js";
import { updateTask, deleteUser } from "../api.js";
import { Toast } from "./toast.js";

/**
 * Muestra un modal de confirmación con acciones personalizadas.
 * @param {Object} opts
 * @param {string} opts.title
 * @param {string} opts.message
 * @param {Array<{label:string, icon:string, variant:'primary'|'danger'|'secondary', onClick:Function}>} opts.actions
 * @returns {Promise<void>}
 */
export function ConfirmModal({ title, message, actions = [] }) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.id = "confirm-modal-overlay";
    overlay.className = "fixed inset-0 z-[10000] flex items-center justify-center p-4";
    overlay.style.cssText = "background: rgba(29,26,36,0.55); backdrop-filter: blur(4px); animation: fadeInOverlay 0.18s ease;";

    const variantClasses = {
      primary: "flex items-center gap-2 px-lg py-sm bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md transition-all active:scale-[0.98]",
      danger:  "flex items-center gap-2 px-lg py-sm bg-error hover:opacity-90 text-on-error rounded-lg font-label-md text-label-md transition-all active:scale-[0.98]",
      secondary: "flex items-center gap-2 px-lg py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors",
    };

    const actionsHtml = actions.map((a, i) => `
      <button data-action-idx="${i}" class="${variantClasses[a.variant] || variantClasses.secondary}">
        ${a.icon ? `<span class="material-symbols-outlined text-[18px]">${a.icon}</span>` : ""}
        ${escHtml(a.label)}
      </button>
    `).join("");

    overlay.innerHTML = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl w-full max-w-[440px] overflow-hidden" style="animation: slideUpModal 0.22s cubic-bezier(.4,0,.2,1);">
        <div class="px-xl pt-xl pb-md">
          <div class="flex items-start gap-md mb-md">
            <div class="w-10 h-10 rounded-full bg-error-container flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-error text-[20px]" style="font-variation-settings:'FILL' 1">warning</span>
            </div>
            <div>
              <h3 class="font-title-sm text-title-sm text-on-surface">${escHtml(title)}</h3>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">${escHtml(message)}</p>
            </div>
          </div>
        </div>
        <div class="px-xl pb-xl flex flex-col gap-sm" id="modal-actions-area">
          ${actionsHtml}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => {
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.18s ease";
      setTimeout(() => { overlay.remove(); resolve(); }, 180);
    };

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    overlay.querySelector("#modal-actions-area").querySelectorAll("[data-action-idx]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const idx = parseInt(btn.dataset.actionIdx);
        close();
        await actions[idx].onClick();
      });
    });
  });
}

/**
 * Modal para reasignar las tareas de un usuario antes de eliminarlo.
 * @param {string} userId - ID del usuario a eliminar
 * @param {string} userName - Nombre del usuario
 * @param {Array} userTasks - Tareas del usuario
 * @param {Array} otherUsers - Otros usuarios disponibles
 * @param {Function} onComplete - Callback al completar
 */
export function showReassignModal(userId, userName, userTasks, otherUsers, onComplete) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-[10001] flex items-center justify-center p-4";
    overlay.style.cssText = "background: rgba(29,26,36,0.65); backdrop-filter: blur(4px); animation: fadeInOverlay 0.18s ease;";

    overlay.innerHTML = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl w-full max-w-[420px] p-xl space-y-lg" style="animation: slideUpModal 0.22s cubic-bezier(.4,0,.2,1);">
        <div class="flex items-start gap-md">
          <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings:'FILL' 1">swap_horiz</span>
          </div>
          <div>
            <h3 class="font-title-sm text-title-sm text-on-surface">Reasignar tareas</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Selecciona el usuario que recibirá las ${userTasks.length} tarea${userTasks.length !== 1 ? "s" : ""} de <strong>${escHtml(userName)}</strong>.
            </p>
          </div>
        </div>
        <div class="space-y-sm">
          <label class="font-label-md text-label-md text-on-surface">Reasignar a:</label>
          <select id="reassignSelect" class="${INPUT_CLASS}">
            ${otherUsers.map(u => `<option value="${u.id}">${escHtml(u.name)} (${u.role})</option>`).join("")}
          </select>
        </div>
        <div class="flex gap-sm justify-end pt-sm border-t border-outline-variant">
          <button id="reassignCancelBtn" class="${BTN_SECONDARY}">Cancelar</button>
          <button id="reassignConfirmBtn" class="${BTN_PRIMARY}">
            <span class="material-symbols-outlined text-[18px]">check</span>Confirmar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => {
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.18s ease";
      setTimeout(() => { overlay.remove(); resolve(); }, 180);
    };

    overlay.querySelector("#reassignCancelBtn").addEventListener("click", close);

    overlay.querySelector("#reassignConfirmBtn").addEventListener("click", async () => {
      const targetId = overlay.querySelector("#reassignSelect").value;
      close();
      try {
        await Promise.all(userTasks.map(t => updateTask(t.id, { userId: targetId })));
        await deleteUser(userId);
        const targetUser = otherUsers.find(u => String(u.id) === String(targetId));
        Toast.show(`Tareas reasignadas a ${targetUser?.name || "usuario"} y usuario eliminado.`, "success");
        await onComplete();
      } catch (err) {
        Toast.show(err.message, "error");
      }
    });
  });
}

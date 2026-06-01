// --- SISTEMA DE NOTIFICACIONES TOAST ---

import { escHtml } from "../utils.js";

export const Toast = (() => {
  let container = null;
  return {
    show(message, type = "info", duration = 3500) {
      if (!container || !document.body.contains(container)) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none";
        document.body.appendChild(container);
      }
      const colours = {
        success: "bg-secondary-container text-on-surface border-secondary",
        error: "bg-error-container text-on-error-container border-error",
        info: "bg-primary-fixed text-on-primary-fixed-variant border-primary",
      };
      const icons = { success: "check_circle", error: "error", info: "info" };
      const toast = document.createElement("div");
      toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-md font-body-sm text-body-sm transition-all duration-300 translate-y-2 opacity-0 ${colours[type] || colours.info}`;
      toast.innerHTML = `
        <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">${icons[type]}</span>
        <span class="flex-1">${escHtml(message)}</span>
        <button class="material-symbols-outlined text-[16px] opacity-60 hover:opacity-100">close</button>
      `;
      container.appendChild(toast);
      requestAnimationFrame(() => toast.classList.remove("translate-y-2", "opacity-0"));

      const dismiss = () => {
        toast.classList.add("opacity-0", "translate-y-2");
        toast.addEventListener("transitionend", () => toast.remove(), { once: true });
      };
      toast.querySelector("button").addEventListener("click", dismiss);
      setTimeout(dismiss, duration);
    }
  };
})();

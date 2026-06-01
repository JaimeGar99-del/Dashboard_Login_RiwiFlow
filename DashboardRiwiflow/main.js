// --- PUNTO DE ENTRADA: Router + Inicialización ---

import { getSession } from "./src/api.js";
import { injectTailwindConfig, injectGlobalStyles } from "./src/config.js";
import { Toast } from "./src/components/toast.js";
import state from "./src/state.js";

// Páginas
import { renderLogin } from "./src/pages/login.js";
import { renderDashboard } from "./src/pages/dashboard.js";
import { renderCreateTask } from "./src/pages/createTask.js";
import { renderEditTask } from "./src/pages/editTask.js";
import { renderUsers } from "./src/pages/users.js";
import { renderCreateUser } from "./src/pages/createUser.js";
import { renderEditUser } from "./src/pages/editUser.js";

// --- TÍTULO DINÁMICO DE VENTANA ---
const PAGE_TITLES = {
  "#login":       "Riwiflow — Login",
  "#dashboard":   "Riwiflow — Dashboard",
  "#create-task": "Riwiflow — New Task",
  "#edit-task":   "Riwiflow — Edit Task",
  "#users":       "Riwiflow — Users Management",
  "#create-user": "Riwiflow — New User",
  "#edit-user":   "Riwiflow — Edit User",
};

function updatePageTitle(hashPath) {
  document.title = PAGE_TITLES[hashPath] || "Riwiflow";
}

// --- ROUTER ---
async function router() {
  const hash = window.location.hash || "#login";
  const [hashPath, queryString] = hash.split("?");
  const queryParams = new URLSearchParams(queryString || "");
  const idParam = queryParams.get("id");

  state.currentUser = getSession();
  updatePageTitle(hashPath);

  if (hashPath !== "#login" && !state.currentUser) {
    window.location.hash = "#login";
    return;
  }
  if (hashPath === "#login" && state.currentUser) {
    window.location.hash = "#dashboard";
    return;
  }

  try {
    switch (hashPath) {
      case "#login":
        renderLogin();
        break;
      case "#dashboard":
        await renderDashboard();
        break;
      case "#create-task":
        if (state.currentUser.role !== "admin") return window.location.hash = "#dashboard";
        await renderCreateTask();
        break;
      case "#edit-task":
        if (!idParam) return window.location.hash = "#dashboard";
        await renderEditTask(idParam);
        break;
      case "#users":
        if (state.currentUser.role !== "admin") return window.location.hash = "#dashboard";
        await renderUsers();
        break;
      case "#create-user":
        if (state.currentUser.role !== "admin") return window.location.hash = "#dashboard";
        await renderCreateUser();
        break;
      case "#edit-user":
        if (!idParam || state.currentUser.role !== "admin") return window.location.hash = "#dashboard";
        await renderEditUser(idParam);
        break;
      default:
        window.location.hash = state.currentUser ? "#dashboard" : "#login";
    }
  } catch (err) {
    console.error("Router error:", err);
    Toast.show(err.message || "An unexpected error occurred.", "error");
  }
}

// --- INICIALIZACIÓN ---
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
  const twScript = document.createElement("script");
  twScript.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
  document.head.appendChild(twScript);

  [
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
  ].forEach(href => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  });

  twScript.onload = () => {
    injectTailwindConfig();
    injectGlobalStyles();
    router();
  };
});
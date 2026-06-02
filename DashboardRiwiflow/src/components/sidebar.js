// --- NAVIGATION SIDEBAR ---

import { clearSession } from "../api.js";

export function renderSidebar(currentUser) {
  const isAdmin = currentUser.role === "admin";
  const aside = document.createElement("aside");
  aside.id = "app-sidebar";
  aside.className = "hidden md:flex flex-col pt-md pb-xl gap-xs h-full bg-surface-container-low border-r border-outline-variant w-[280px] shrink-0";
  aside.innerHTML = `
    <div class="px-gutter mb-xl">
      <h1 class="font-headline-md text-headline-md font-bold text-primary">Riwiflow</h1>
      <p class="font-body-sm text-body-sm text-on-surface-variant">Product Team</p>
    </div>
    <nav class="flex-1 space-y-1">
      <a id="navDashboard" class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 rounded-lg mx-2 px-4 py-3 font-body-sm text-body-sm transition-all cursor-pointer">
        <span class="material-symbols-outlined mr-3">dashboard</span>
        <span>Dashboard</span>
      </a>
      ${isAdmin ? `
      <a id="navUsers" class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all cursor-pointer">
        <span class="material-symbols-outlined mr-3">manage_accounts</span>
        <span>Users</span>
      </a>` : ""}
    </nav>
    <div class="px-4 mt-auto space-y-2">
      ${isAdmin ? `
      <button id="navCreate" class="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity">
        <span class="material-symbols-outlined">add</span>New Task
      </button>` : ""}
      <button id="logoutBtn" class="w-full flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors">
        <span class="material-symbols-outlined text-[18px]">logout</span>Logout
      </button>
    </div>
  `;

  const hash = window.location.hash || "#dashboard";
  if (hash === "#dashboard" || hash.startsWith("#edit-task") || hash.startsWith("#create-task")) {
    aside.querySelector("#navDashboard")?.classList.add("bg-primary-fixed", "text-on-primary-fixed-variant");
  } else if (hash === "#users" || hash.startsWith("#edit-user") || hash.startsWith("#create-user")) {
    aside.querySelector("#navUsers")?.classList.add("bg-primary-fixed", "text-on-primary-fixed-variant");
  }

  aside.querySelector("#navDashboard")?.addEventListener("click", () => window.location.hash = "#dashboard");
  aside.querySelector("#navUsers")?.addEventListener("click", () => window.location.hash = "#users");
  aside.querySelector("#navCreate")?.addEventListener("click", () => window.location.hash = "#create-task");
  aside.querySelector("#logoutBtn").addEventListener("click", () => {
    clearSession();
    window.location.hash = "#login";
  });
  return aside;
}
// --- SHELL: Layout persistente (sidebar + topbar + pageContent) ---

import { renderSidebar } from "./components/sidebar.js";
import { escHtml, initials } from "./utils.js";
import state from "./state.js";

/**
 * Construye o reutiliza el layout principal de la aplicación.
 * Solo refresca el sidebar si el shell ya existe.
 * @returns {HTMLElement} El contenedor #pageContent
 */
export function getOrBuildShell() {
  const appElement = document.getElementById("app");
  let pageContent = document.getElementById("pageContent");
  if (pageContent) {
    const sidebarContainer = document.getElementById("sidebarContainer");
    if (sidebarContainer) {
      sidebarContainer.innerHTML = "";
      sidebarContainer.appendChild(renderSidebar(state.currentUser));
    }
    return pageContent;
  }

  appElement.innerHTML = `
    <div id="layout" class="bg-background text-on-background overflow-hidden h-screen flex relative">
      <div class="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div style="position:absolute;top:-12%;right:-8%;width:42%;height:42%;background:rgba(235,221,255,0.35);filter:blur(100px);border-radius:50%"></div>
        <div style="position:absolute;bottom:-12%;left:-8%;width:32%;height:32%;background:rgba(227,225,237,0.25);filter:blur(90px);border-radius:50%"></div>
        <div style="position:absolute;top:40%;left:30%;width:25%;height:25%;background:rgba(83,0,183,0.06);filter:blur(80px);border-radius:50%"></div>
      </div>
      <div id="sidebarContainer"></div>
      <div id="rightSide" class="flex-1 flex flex-col min-w-0 relative z-10">
        <header id="appTopBar" class="flex justify-between items-center h-16 px-gutter w-full bg-surface border-b border-outline-variant z-40 shrink-0">
          <div class="flex items-center gap-4 flex-1">
            <div class="relative max-w-md w-full">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input class="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search tasks..." id="globalSearch" type="text" />
            </div>
          </div>
          <div class="flex items-center gap-4 ml-4">
            <button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">notifications</button>
            <div class="flex items-center gap-sm">
              <div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center border border-outline-variant">
                <span class="font-label-md text-on-primary-fixed-variant text-xs">${initials(state.currentUser.name)}</span>
              </div>
              <div class="hidden sm:block text-left">
                <p class="font-label-md text-label-md text-on-surface leading-none">${escHtml(state.currentUser.name)}</p>
                <p class="font-body-sm text-body-sm text-on-surface-variant capitalize">${escHtml(state.currentUser.role)}</p>
              </div>
            </div>
          </div>
        </header>
        <div id="pageContent" class="flex-1 flex flex-col overflow-auto"></div>
      </div>
    </div>
  `;
  document.getElementById("sidebarContainer").appendChild(renderSidebar(state.currentUser));
  return document.getElementById("pageContent");
}

/**
 * Construye el layout de páginas de formulario con encabezado y botón "atrás".
 * @param {string} title - Título del formulario
 * @param {string} subtitle - Subtítulo descriptivo
 * @param {string} backHash - Hash al que navegar al presionar "atrás"
 * @returns {HTMLElement} El contenedor #formArea
 */
export function buildFormLayout(title, subtitle, backHash = "#dashboard") {
  const pageContent = getOrBuildShell();
  pageContent.innerHTML = `
    <div class="flex-1 flex flex-col overflow-auto">
      <div class="flex items-center justify-between px-xl py-md border-b border-outline-variant bg-surface/80 backdrop-blur-sm shrink-0">
        <div class="flex items-center gap-md">
          <button id="backBtn" class="flex items-center gap-xs text-on-surface-variant hover:text-on-surface transition-colors">
            <span class="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h2 class="font-headline-md text-headline-md text-on-surface">${title}</h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">${subtitle}</p>
          </div>
        </div>
      </div>
      <div class="flex-1 flex items-start justify-center px-xl py-xl overflow-auto" id="formArea"></div>
    </div>
  `;
  document.getElementById("backBtn").addEventListener("click", () => window.location.hash = backHash);
  return document.getElementById("formArea");
}

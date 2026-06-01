// --- PÁGINA CREAR USUARIO ---

import { createUser } from "../api.js";
import { buildFormLayout } from "../shell.js";
import { INPUT_CLASS, BTN_PRIMARY, BTN_SECONDARY, FORM_CARD } from "../constants.js";
import { Toast } from "../components/toast.js";

export async function renderCreateUser() {
  const formArea = buildFormLayout("Create New User", "Add a new team member profile", "#users");
  formArea.innerHTML = `
    <div class="w-full max-w-[520px]">
      <div class="${FORM_CARD}">
        <h3 class="font-title-sm text-title-sm text-on-surface">Account Identification</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Enter profile credentials and system role assignment</p>
        <div class="border-t border-outline-variant"></div>
        <form id="createUserForm" class="space-y-lg">
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Full Name</label>
            <input id="userName" type="text" placeholder="e.g., Maria Gomez" required class="${INPUT_CLASS}" />
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Email</label>
            <input id="userEmail" type="email" placeholder="maria@company.com" required class="${INPUT_CLASS}" />
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Password</label>
            <input id="userPassword" type="password" placeholder="••••••••" required class="${INPUT_CLASS}" />
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Role</label>
            <select id="userRole" class="${INPUT_CLASS}">
              <option value="coder">Coder</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="border-t border-outline-variant"></div>
          <div class="flex gap-md justify-end">
            <button type="button" id="cancelUserBtn" class="${BTN_SECONDARY}">Cancel</button>
            <button type="submit" class="${BTN_PRIMARY}">Create User</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("cancelUserBtn").addEventListener("click", () => window.location.hash = "#users");
  document.getElementById("createUserForm").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.target.querySelector("[type=submit]");
    btn.disabled = true;
    btn.textContent = "Creating...";
    try {
      await createUser({
        name: document.getElementById("userName").value.trim(),
        email: document.getElementById("userEmail").value.trim(),
        password: document.getElementById("userPassword").value.trim(),
        role: document.getElementById("userRole").value,
      });
      Toast.show("User created successfully.", "success");
      window.location.hash = "#users";
    } catch (err) {
      Toast.show(err.message, "error");
      btn.disabled = false;
      btn.textContent = "Create User";
    }
  });
}

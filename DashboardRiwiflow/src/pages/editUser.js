// --- PÁGINA EDITAR USUARIO ---

import { getUserById, updateUser, saveSession } from "../api.js";
import { buildFormLayout } from "../shell.js";
import { INPUT_CLASS, BTN_PRIMARY, BTN_SECONDARY, FORM_CARD } from "../constants.js";
import { escHtml } from "../utils.js";
import { Toast } from "../components/toast.js";
import state from "../state.js";

export async function renderEditUser(id) {
  const targetUser = await getUserById(id);
  if (!targetUser) return window.location.hash = "#users";

  const formArea = buildFormLayout("Edit User", "Modify team member credentials and parameters", "#users");
  formArea.innerHTML = `
    <div class="w-full max-w-[520px]">
      <div class="${FORM_CARD}">
        <h3 class="font-title-sm text-title-sm text-on-surface">Account Credentials</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Update credentials, profile name, and system permissions role</p>
        <div class="border-t border-outline-variant"></div>
        <form id="editUserForm" class="space-y-lg">
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Full Name</label>
            <input id="userName" type="text" value="${escHtml(targetUser.name)}" required class="${INPUT_CLASS}" />
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Email</label>
            <input id="userEmail" type="email" value="${escHtml(targetUser.email)}" required class="${INPUT_CLASS}" />
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Password (Leave blank to keep unchanged)</label>
            <input id="userPassword" type="password" placeholder="••••••••" class="${INPUT_CLASS}" />
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Role</label>
            <select id="userRole" class="${INPUT_CLASS}">
              <option value="coder" ${targetUser.role === "coder" ? "selected" : ""}>Coder</option>
              <option value="admin" ${targetUser.role === "admin" ? "selected" : ""}>Admin</option>
            </select>
          </div>
          <div class="border-t border-outline-variant"></div>
          <div class="flex gap-md justify-end">
            <button type="button" id="cancelEditUserBtn" class="${BTN_SECONDARY}">Cancel</button>
            <button type="submit" class="${BTN_PRIMARY}">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById("cancelEditUserBtn").addEventListener("click", () => window.location.hash = "#users");
  document.getElementById("editUserForm").addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.target.querySelector("[type=submit]");
    btn.disabled = true;
    btn.textContent = "Saving...";
    const patch = {
      name: document.getElementById("userName").value.trim(),
      email: document.getElementById("userEmail").value.trim(),
      role: document.getElementById("userRole").value
    };
    const pass = document.getElementById("userPassword").value.trim();
    if (pass) patch.password = pass;

    try {
      await updateUser(id, patch);
      Toast.show("User updated successfully.", "success");
      if (String(id) === String(state.currentUser.id)) {
        saveSession(await getUserById(id));
      }
      window.location.hash = "#users";
    } catch (err) {
      Toast.show(err.message, "error");
      btn.disabled = false;
      btn.textContent = "Save Changes";
    }
  });
}

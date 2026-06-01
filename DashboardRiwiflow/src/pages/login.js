// --- PÁGINA DE LOGIN ---

import { loginUser, saveSession } from "../api.js";
import { INPUT_CLASS, BTN_PRIMARY } from "../constants.js";
import state from "../state.js";

export function renderLogin() {
  document.getElementById("app").innerHTML = `
    <div class="bg-surface-container-lowest text-on-surface min-h-screen flex flex-col">
      <main class="flex-grow flex items-center justify-center px-gutter py-xxl">
        <div class="w-full max-w-[440px] space-y-xl">
          <!-- Brand Identity -->
          <div class="text-center space-y-md">
            <h1 class="font-headline-md text-headline-md font-bold text-primary tracking-tight">Riwiflow</h1>
            <p class="font-body-md text-body-md text-on-surface-variant">Sign in to your professional workspace</p>
          </div>
          <!-- Login Card -->
          <div class="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl space-y-lg transition-all">
            <form class="space-y-lg" id="loginForm">
              <!-- Email Field -->
              <div class="space-y-sm">
                <label class="font-label-md text-label-md text-on-surface" for="email">Email address</label>
                <div class="relative">
                  <input class="${INPUT_CLASS}" id="email" type="email" placeholder="name@company.com" required />
                </div>
              </div>
              <!-- Password Field -->
              <div class="space-y-sm">
                <div class="flex justify-between items-center">
                  <label class="font-label-md text-label-md text-on-surface" for="password">Password</label>
                  <a class="font-label-md text-label-md text-primary hover:underline transition-all cursor-pointer">Forgot password?</a>
                </div>
                <div class="relative">
                  <input class="${INPUT_CLASS}" id="password" type="password" placeholder="••••••••" required />
                </div>
              </div>
              <!-- Error Message -->
              <p class="text-error font-body-sm text-body-sm min-h-[20px]" id="errorMsg"></p>
              <!-- CTA Button -->
              <div class="pt-sm">
                <button class="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-md px-lg rounded-lg transition-all active:scale-[0.98] duration-150 flex items-center justify-center gap-sm" type="submit">
                  Login
                  <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </form>
            <!-- Divider -->
            <div class="relative py-sm">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-outline-variant"></div>
              </div>
              <div class="relative flex justify-center text-label-sm">
                <span class="bg-surface-container-lowest px-md text-outline font-label-sm uppercase tracking-widest">or continue with</span>
              </div>
            </div>
            <!-- Secondary Auth Actions -->
            <div class="grid grid-cols-1 gap-md">
              <button type="button" class="w-full flex items-center justify-center gap-md py-md border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors duration-200">
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Sign in with Google
              </button>
            </div>
          </div>
          <!-- Footer Links -->
          <div class="text-center">
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              Don't have an account?
              <a class="text-primary font-label-md hover:underline cursor-pointer">Create an account</a>
            </p>
          </div>
        </div>
      </main>
      <!-- Visual Background Element -->
      <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-fixed/20 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary-fixed/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  `;

  document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = "";
    const btn = e.target.querySelector("[type=submit]");
    btn.disabled = true;
    btn.textContent = "Signing in...";

    try {
      const user = await loginUser(email, password);
      if (!user) {
        errorMsg.textContent = "Invalid credentials. Please try again.";
        btn.disabled = false;
        btn.innerHTML = `Login <span class="material-symbols-outlined text-[18px]">arrow_forward</span>`;
        return;
      }
      saveSession(user);
      state.currentUser = user;
      window.location.hash = "#dashboard";
    } catch (err) {
      errorMsg.textContent = err.message || "Connection error.";
      btn.disabled = false;
      btn.innerHTML = `Login <span class="material-symbols-outlined text-[18px]">arrow_forward</span>`;
    }
  });
}

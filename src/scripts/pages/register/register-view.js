export default class RegisterView {
  render() {
    return `
      <section class="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
        <!-- Decoration -->
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
        </div>

        <div class="glass-panel w-full max-w-lg p-10 md:p-16 rounded-[3rem] relative z-10 shadow-2xl shadow-primary-900/5">
          <div class="text-center mb-12">
            <a href="#/" class="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-[2rem] text-white text-3xl shadow-2xl shadow-primary-600/30 mb-8 hover:scale-110 transition-transform duration-500">
              <i class="fa-solid fa-user-plus"></i>
            </a>
            <h1 class="text-4xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Daftar Akun</h1>
            <p class="text-slate-500 font-bold text-lg">Mulai bagikan ceritamu hari ini.</p>
          </div>

          <form id="storiapp-register-form" class="space-y-6" novalidate>
            <div class="space-y-3">
              <label for="name" class="input-label">Nama Lengkap</label>
              <div class="relative group">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <i class="fa-solid fa-user-tag text-xl"></i>
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="input-field pl-14"
                  placeholder="Nama Lengkap Anda"
                  autocomplete="name"
                  required
                />
              </div>
              <p id="name-error" class="hidden mt-3 text-xs font-black text-rose-500 flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                <i class="fa-solid fa-circle-exclamation"></i> <span class="error-text"></span>
              </p>
            </div>

            <div class="space-y-3">
              <label for="email" class="input-label">Alamat Email</label>
              <div class="relative group">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <i class="fa-regular fa-envelope text-xl"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="input-field pl-14"
                  placeholder="name@example.com"
                  autocomplete="email"
                  required
                />
              </div>
              <p id="email-error" class="hidden mt-3 text-xs font-black text-rose-500 flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                <i class="fa-solid fa-circle-exclamation"></i> <span class="error-text"></span>
              </p>
            </div>

            <div class="space-y-3">
              <label for="password" class="input-label">Kata Sandi</label>
              <div class="relative group">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <i class="fa-solid fa-shield-halved text-xl"></i>
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  class="input-field pl-14 pr-14"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  required
                />
                <button type="button" id="storiapp-toggle-password" class="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Tampilkan kata sandi">
                  <i class="fa-regular fa-eye text-xl" id="storiapp-eye-icon"></i>
                </button>
              </div>
              <p id="password-error" class="hidden mt-3 text-xs font-black text-rose-500 flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
                <i class="fa-solid fa-circle-exclamation"></i> <span class="error-text"></span>
              </p>
            </div>

            <button type="submit" class="btn-primary w-full py-5 text-lg uppercase tracking-widest font-black" id="storiapp-register-btn">
              <span class="btn-text">Daftar Sekarang</span>
              <div class="animate-spin h-6 w-6 border-3 border-white/30 border-t-white rounded-full hidden" id="storiapp-loader"></div>
            </button>
          </form>

          <div class="mt-12 text-center pt-10 border-t border-slate-100">
            <p class="text-slate-500 font-bold">
              Sudah punya akun? 
              <a href="#/login" class="text-primary-600 font-black hover:underline underline-offset-4 ml-1">Masuk di sini</a>
            </p>
          </div>
        </div>
      </section>
    `;
  }

  setSubmitLoading(isLoading) {
    const btn = document.querySelector("#storiapp-register-btn");
    const text = btn.querySelector(".btn-text");
    const loader = document.querySelector("#storiapp-loader");
    btn.disabled = isLoading;
    text.classList.toggle("hidden", isLoading);
    loader.classList.toggle("hidden", !isLoading);
  }

  showFieldError(fieldId, message) {
    const errorEl = document.querySelector(`#${fieldId}-error`);
    const inputEl = document.querySelector(`#${fieldId}`);
    if (errorEl) {
      const textSpan = errorEl.querySelector(".error-text");
      if (textSpan) textSpan.textContent = message;
      errorEl.classList.toggle("hidden", !message);
    }
    if (inputEl) {
      inputEl.classList.toggle("border-rose-500", !!message);
      inputEl.classList.toggle("ring-rose-500/10", !!message);
    }
  }

  bindPasswordToggle() {
    const toggleBtn = document.querySelector("#storiapp-toggle-password");
    const passwordInput = document.querySelector("#password");
    const eyeIcon = document.querySelector("#storiapp-eye-icon");
    if (!toggleBtn || !passwordInput) return;
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      if (eyeIcon) {
        eyeIcon.className = isPassword
          ? "fa-regular fa-eye-slash text-xl"
          : "fa-regular fa-eye text-xl";
      }
    });
  }

  bindFormSubmit(handler) {
    const form = document.querySelector("#storiapp-register-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.showFieldError("name", "");
      this.showFieldError("email", "");
      this.showFieldError("password", "");

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;

      let valid = true;
      if (!name) {
        this.showFieldError("name", "Nama lengkap wajib diisi.");
        valid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.showFieldError("email", "Alamat email tidak valid.");
        valid = false;
      }
      if (!password || password.length < 8) {
        this.showFieldError("password", "Kata sandi minimal 8 karakter.");
        valid = false;
      }
      if (valid) handler({ name, email, password });
    });
  }
}



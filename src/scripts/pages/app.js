import { resolveRoute } from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { isLoggedIn, clearAuth, getUserName } from '../utils/index';
import NotificationHelper from '../utils/notification-helper';
import { showToast } from '../utils/alert-helper';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #backdrop = null;
  #closeButton = null;
  #navList = null;
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#backdrop = document.querySelector('#storiapp-backdrop');
    this.#closeButton = document.querySelector('#storiapp-drawer-close');
    this.#navList = document.querySelector('#storiapp-nav-list');
    this.#setupDrawer();
  }

  #setupDrawer() {
    const openDrawer = () => {
      this.#navigationDrawer.classList.remove('translate-x-full');
      this.#navigationDrawer.classList.add('translate-x-0');
      this.#backdrop.classList.remove('opacity-0', 'pointer-events-none');
      this.#backdrop.classList.add('opacity-100', 'pointer-events-auto');
      this.#drawerButton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      this.#navigationDrawer.classList.add('translate-x-full');
      this.#navigationDrawer.classList.remove('translate-x-0');
      this.#backdrop.classList.add('opacity-0', 'pointer-events-none');
      this.#backdrop.classList.remove('opacity-100', 'pointer-events-auto');
      this.#drawerButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    this.#drawerButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });

    this.#closeButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });

    this.#backdrop?.addEventListener('click', () => {
      closeDrawer();
    });

    // Close on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  async #updateNav() {
    if (!this.#navList) return;
    const loggedIn = isLoggedIn();
    const currentRoute = getActiveRoute();
    const isAuthPage = currentRoute === '/login' || currentRoute === '/register';

    if (isAuthPage) {
      this.#navList.innerHTML = '';
      this.#drawerButton?.classList.add('hidden');
      return;
    }

    this.#drawerButton?.classList.remove('hidden');

    let isSubscribed = false;
    try {
      if (loggedIn) {
        isSubscribed = !!(await NotificationHelper.getPushSubscription());
      }
    } catch (error) {
      console.warn('Push check failed:', error);
    }

    const notificationToggle = loggedIn
      ? `<li><button id="notification-toggle" class="flex items-center gap-2.5 px-4 py-2 rounded-xl font-bold text-slate-600 transition-all hover:bg-slate-100 group">
          <i class="fa-solid fa-fw ${isSubscribed ? 'fa-bell-slash' : 'fa-bell'} transition-all duration-300 group-hover:rotate-12 group-hover:text-primary-600"></i> 
          <span class="lg:inline">${isSubscribed ? 'Matikan Notifikasi' : 'Aktifkan Notifikasi'}</span>
         </button></li>`
      : '';

    const greeting = loggedIn
      ? `<li><span class="flex items-center gap-2.5 px-4 py-2 text-slate-400 font-bold select-none"><i class="fa-solid fa-fw fa-circle-user text-slate-300"></i> <span class="lg:inline">${getUserName()}</span></span></li>`
      : '';

    const authLinks = loggedIn
      ? `<li><a href="#/add-story" class="nav-link ${currentRoute === '/add-story' ? 'active' : ''} group">
          <i class="fa-solid fa-fw fa-plus-circle transition-all duration-300 group-hover:scale-125 group-hover:text-primary-600"></i> 
          <span class="lg:inline">Tambah Cerita</span>
         </a></li>
         <li><button id="storiapp-logout-btn" class="flex items-center gap-2.5 px-4 py-2 rounded-xl font-black text-rose-500 transition-all hover:bg-rose-50 group">
          <i class="fa-solid fa-fw fa-right-from-bracket transition-transform duration-300 group-hover:translate-x-1.5"></i> 
          <span class="lg:inline">Keluar</span>
         </button></li>`
      : `<li><a href="#/login" class="nav-link ${currentRoute === '/login' ? 'active' : ''}"><i class="fa-solid fa-fw fa-right-to-bracket"></i> Masuk</a></li>
         <li><a href="#/register" class="btn-primary py-2.5 px-6 text-[10px] uppercase tracking-widest font-black"><i class="fa-solid fa-fw fa-user-plus"></i> Daftar</a></li>`;

    this.#navList.innerHTML = `
      <li><a href="#/" class="nav-link ${currentRoute === '/' ? 'active' : ''} group">
        <i class="fa-solid fa-fw fa-house-chimney transition-all duration-300 group-hover:-translate-y-1 group-hover:text-primary-600"></i> 
        <span class="lg:inline">Beranda</span>
      </a></li>
      ${notificationToggle}
      ${authLinks}
      ${greeting}
    `;

    if (loggedIn) {
      document.querySelector('#storiapp-logout-btn')?.addEventListener('click', () => {
        clearAuth();
        window.location.hash = '#/login';
      });

      const toggleBtn = document.querySelector('#notification-toggle');
      toggleBtn?.addEventListener('click', async () => {
        try {
          if (isSubscribed) {
            await NotificationHelper.unsubscribePush();
            showToast('Notifikasi dimatikan', 'success');
          } else {
            const sub = await NotificationHelper.subscribePush();
            if (sub) showToast('Notifikasi diaktifkan!', 'success');
          }
          this.#updateNav();
        } catch (error) {
          showToast('Fitur tidak tersedia.', 'error');
        }
      });
    }

    this.#navList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          this.#navigationDrawer.classList.add('translate-x-full');
          this.#navigationDrawer.classList.remove('translate-x-0');
          this.#backdrop.classList.add('opacity-0', 'pointer-events-none');
          this.#backdrop.classList.remove('opacity-100', 'pointer-events-auto');
          this.#drawerButton.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  async renderPage() {
    try {
      const routePath = getActiveRoute();
      const { page: PageClass, needsAuth } = resolveRoute(routePath);

      if (needsAuth && !isLoggedIn()) {
        window.location.hash = '#/login';
        return;
      }

      if (!PageClass) {
        window.location.hash = '#/';
        return;
      }

      this.#currentPage = new PageClass();
      this.#updateNav();

      const updateDOM = async () => {
        try {
          this.#content.innerHTML = await this.#currentPage.render();
          await this.#currentPage.afterRender();
          const mainContent = document.querySelector('#main-content');
          if (mainContent) mainContent.focus({ preventScroll: true });
          window.scrollTo(0, 0);
        } catch (innerError) {
          this.#renderErrorState(innerError.message);
        }
      };

      if (document.startViewTransition) {
        document.startViewTransition(updateDOM);
      } else {
        await updateDOM();
      }
    } catch (error) {
      this.#renderErrorState(error.message);
    }
  }

  #renderErrorState(message) {
    if (!this.#content) return;
    this.#content.innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div class="w-24 h-24 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-lg shadow-rose-200">
          <i class="fa-solid fa-circle-exclamation"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Terjadi Kesalahan</h2>
        <p class="text-slate-500 font-medium max-w-md mb-8">${message || 'Gagal memuat halaman.'}</p>
        <button onclick="window.location.reload()" class="btn-primary">Muat Ulang</button>
      </div>
    `;
  }
}

export default App;

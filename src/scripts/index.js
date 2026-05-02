import '../styles/styles.css';
import App from './pages/app';
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      const confirmRefresh = confirm('Aplikasi versi baru tersedia. Refresh sekarang?');
      if (confirmRefresh) {
        location.reload();
      }
    },
    onOfflineReady() {
      console.log('Aplikasi siap digunakan secara offline.');
    },
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#storiapp-main'),
    drawerButton: document.querySelector('#storiapp-drawer-button'),
    navigationDrawer: document.querySelector('#storiapp-navigation'),
  });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

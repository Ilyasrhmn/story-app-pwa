import CONFIG from '../config';
import { subscribeNotification, unsubscribeNotification } from '../data/api';

const NotificationHelper = {
  async sendNotification({ title, options }) {
    // Menghapus trigger lokal sesuai standar Story API Dicoding.
    // Notifikasi akan muncul secara otomatis via event 'push' di Service Worker.
    console.log('Notification triggered by server');
  },

  _checkAvailability() {
    return 'Notification' in window && 'serviceWorker' in navigator;
  },

  _checkPermission() {
    return Notification.permission === 'granted';
  },

  async _requestPermission() {
    const status = await Notification.requestPermission();

    if (status === 'denied') {
    }

    if (status === 'default') {
    }
  },

  async _showNotification({ title, options }) {
    try {
      const registration = await this._getServiceWorkerRegistration();
      if (registration) {
        registration.showNotification(title, options);
      }
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  },

  async _getServiceWorkerRegistration() {
    if (!('serviceWorker' in navigator)) return null;
    
    try {
      // First, try to get current registration immediately
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) return registration;
      
      // If not available, wait with a short timeout to prevent blocking the UI
      const swReadyPromise = navigator.serviceWorker.ready;
      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve(null), 1000)
      );

      return await Promise.race([swReadyPromise, timeoutPromise]);
    } catch (error) {
      console.error('Failed to get Service Worker registration:', error);
      return null;
    }
  },

  async getPushSubscription() {
    try {
      const registration = await this._getServiceWorkerRegistration();
      if (!registration) return null;
      return await registration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to get push subscription:', error);
      return null;
    }
  },

  async subscribePush() {
    if (!this._checkAvailability()) {
      throw new Error('Notification not supported in this browser');
    }

    if (!this._checkPermission()) {
      await this._requestPermission();
    }

    if (!this._checkPermission()) {
      throw new Error('User denied notification permission');
    }

    const registration = await this._getServiceWorkerRegistration();
    if (!registration) {
      throw new Error('Service Worker not available for subscription');
    }

    // 1. Daftarkan Service Worker ke Push Manager Browser
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this._urlBase64ToUint8Array(CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY),
    });

    // 2. Kirim data (endpoint & keys) ke Database Server Story API
    try {
      const response = await subscribeNotification(subscription); 
      
      if (response.error) {
        // Rollback: Batalkan langganan lokal jika server gagal memproses
        await subscription.unsubscribe();
        throw new Error(response.message);
      }
      
      return subscription;
    } catch (error) {
      // Rollback: Batalkan langganan lokal jika koneksi terputus
      await subscription.unsubscribe();
      console.error('Gagal menyimpan data langganan ke server:', error);
      throw error; 
    }
  },

  async unsubscribePush() {
    try {
      const subscription = await this.getPushSubscription();
      if (subscription) {
        const { endpoint } = subscription.toJSON();
        
        // 1. Hapus dari Database Server Story API
        await unsubscribeNotification(endpoint);
        
        // 2. Cabut izin dari Push Manager Browser
        await subscription.unsubscribe();
      }
    } catch (error) {
      console.error('Gagal memutus langganan:', error);
      throw error;
    }
  },

  _urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },
};

export default NotificationHelper;


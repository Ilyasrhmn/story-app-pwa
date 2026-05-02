import CONFIG from '../config';

const NotificationHelper = {
  async sendNotification({ title, options }) {
    if (!this._checkAvailability()) {
      console.log('Notification not supported in this browser');
      return;
    }

    if (!this._checkPermission()) {
      console.log('User did not granted permission');
      await this._requestPermission();
    }

    this._showNotification({ title, options });
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
      console.log('Notification permission denied');
    }

    if (status === 'default') {
      console.log('Notification permission cancelled');
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
    
    // Add a timeout to prevent hanging if SW fails to become ready
    const swReadyPromise = navigator.serviceWorker.ready;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Service Worker ready timeout')), 3000)
    );

    try {
      return await Promise.race([swReadyPromise, timeoutPromise]);
    } catch (error) {
      console.warn('Service Worker registration not ready or timed out:', error);
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
    if (!this._checkPermission()) {
      await this._requestPermission();
    }
    
    // Check again after request
    if (!this._checkPermission()) {
      throw new Error('User denied notification permission');
    }

    const registration = await this._getServiceWorkerRegistration();
    if (!registration) {
      throw new Error('Service Worker not available for subscription');
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this._urlBase64ToUint8Array(CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY),
    });
    console.log('Subscribed:', subscription);
    return subscription;
  },

  async unsubscribePush() {
    try {
      const subscription = await this.getPushSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Unsubscribed');
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
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

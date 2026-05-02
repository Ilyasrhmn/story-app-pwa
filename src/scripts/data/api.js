import CONFIG from '../config';
import DbHelper from './db-helper';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
};

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
}

export async function login({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function getStories({ page = 1, size = 20, location = 1 } = {}) {
  const url = new URL(ENDPOINTS.STORIES);
  url.searchParams.set('page', page);
  url.searchParams.set('size', size);
  url.searchParams.set('location', location);

  try {
    const response = await fetch(url.toString(), {
      headers: { ...getAuthHeader() },
    });
    const result = await response.json();

    if (result && !result.error) {
      const stories = result.listStory || [];
      for (const story of stories) {
        await DbHelper.putStory(story);
      }
    }
    return result;
  } catch (error) {
    console.error('Fetch failed, returning local data:', error);
    const localStories = await DbHelper.getAllStories();
    return {
      error: false,
      message: 'Stories fetched from local database (Offline Mode)',
      listStory: localStories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    };
  }
}

export async function addStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  if (lat !== undefined && lon !== undefined) {
    formData.append('lat', lat);
    formData.append('lon', lon);
  }

  try {
    const response = await fetch(ENDPOINTS.STORIES, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return response.json();
  } catch (error) {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await DbHelper.putPendingStory({
        description,
        photo,
        lat,
        lon,
        token: localStorage.getItem('token'),
        createdAt: new Date().toISOString(),
      });
      try {
        await registration.sync.register('sync-stories');
        return {
          error: false,
          message: 'Offline: Cerita disimpan dan akan dikirim saat online.',
        };
      } catch (syncErr) {
        return { error: true, message: 'Gagal mendaftarkan sinkronisasi.' };
      }
    }
    return { error: true, message: 'Gagal mengirim cerita. Cek koneksi internet.' };
  }
}

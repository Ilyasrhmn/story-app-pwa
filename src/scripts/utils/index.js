export function showFormattedDate(date, locale = 'id-ID', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function saveAuth({ token, name }) {
  localStorage.setItem('token', token);
  localStorage.setItem('userName', name);
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
}

export function getUserName() {
  return localStorage.getItem('userName') || 'Pengguna';
}

import { login } from '../../data/api';
import { saveAuth } from '../../utils/index';
import { showToast } from '../../utils/alert-helper';

export default class LoginPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  init() {
    this.#view.bindPasswordToggle();
    this.#view.bindFormSubmit(this.#handleLogin.bind(this));
  }

  async #handleLogin({ email, password }) {
    this.#view.setSubmitLoading(true);
    try {
      const result = await login({ email, password });
      if (result.error) {
        showToast(result.message || 'Login gagal. Periksa kembali email dan kata sandi.', 'error');
      } else {
        saveAuth({ token: result.loginResult.token, name: result.loginResult.name });
        showToast(`Selamat datang, ${result.loginResult.name}!`, 'success');
        setTimeout(() => { window.location.hash = '#/'; }, 800);
      }
    } catch {
      showToast('Gagal terhubung ke server. Coba lagi.', 'error');
    } finally {
      this.#view.setSubmitLoading(false);
    }
  }
}

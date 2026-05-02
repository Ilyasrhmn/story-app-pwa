import { register } from '../../data/api';
import { showToast } from '../../utils/alert-helper';

export default class RegisterPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  init() {
    this.#view.bindPasswordToggle();
    this.#view.bindFormSubmit(this.#handleRegister.bind(this));
  }

  async #handleRegister({ name, email, password }) {
    this.#view.setSubmitLoading(true);
    try {
      const result = await register({ name, email, password });
      if (result.error) {
        showToast(result.message || 'Pendaftaran gagal. Coba lagi.', 'error');
      } else {
        showToast('Akun berhasil dibuat! Silakan masuk.', 'success');
        setTimeout(() => { window.location.hash = '#/login'; }, 1000);
      }
    } catch {
      showToast('Gagal terhubung ke server. Coba lagi.', 'error');
    } finally {
      this.#view.setSubmitLoading(false);
    }
  }
}

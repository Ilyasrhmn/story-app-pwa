import LoginView from './login-view';
import LoginPresenter from './login-presenter';

export default class LoginPage {
  #view;
  #presenter;

  constructor() {
    this.#view = new LoginView();
    this.#presenter = new LoginPresenter(this.#view);
  }

  async render() {
    return this.#view.render();
  }

  async afterRender() {
    this.#presenter.init();
  }
}

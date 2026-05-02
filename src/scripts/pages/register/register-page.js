import RegisterView from './register-view';
import RegisterPresenter from './register-presenter';

export default class RegisterPage {
  #view;
  #presenter;

  constructor() {
    this.#view = new RegisterView();
    this.#presenter = new RegisterPresenter(this.#view);
  }

  async render() {
    return this.#view.render();
  }

  async afterRender() {
    this.#presenter.init();
  }
}

import SavedView from './saved-view';
import SavedPresenter from './saved-presenter';

export default class SavedPage {
  #view;
  #presenter;

  constructor() {
    this.#view = new SavedView();
    this.#presenter = new SavedPresenter(this.#view);
  }

  async render() {
    return this.#view.render();
  }

  async afterRender() {
    await this.#presenter.init();
  }
}

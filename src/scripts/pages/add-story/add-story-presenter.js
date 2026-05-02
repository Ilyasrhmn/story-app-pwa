import { addStory } from '../../data/api';
import { createMap, addClickableMarker } from '../../utils/map-helper';
import { showToast } from '../../utils/alert-helper';
import CONFIG from '../../config';

export default class AddStoryPresenter {
  #view;
  #map = null;
  #clickableMarkerHandler = null;
  #selectedPhoto = null;
  #selectedLat = null;
  #selectedLng = null;

  constructor(view) {
    this.#view = view;
  }

  async init() {
    this.#view.bindTabSwitch();
    this.#view.bindFileUpload((file) => { this.#selectedPhoto = file; });
    await this.#view.bindCamera((file) => { this.#selectedPhoto = file; });
    this.#initMap();
    this.#view.bindFormSubmit(this.#handleSubmit.bind(this));
    this.#view.bindCancel(() => { window.location.hash = '#/'; });
    this.#view.bindClearCoords(this.#clearLocation.bind(this));
  }

  #initMap() {
    this.#map = createMap('storiapp-add-story-map', {
      lat: CONFIG.DEFAULT_LAT,
      lng: CONFIG.DEFAULT_LNG,
      zoom: 5,
    });

    setTimeout(() => {
      if (this.#map) this.#map.invalidateSize();
    }, 100);

    this.#clickableMarkerHandler = addClickableMarker(this.#map, (lat, lng) => {
      this.#selectedLat = lat;
      this.#selectedLng = lng;
      this.#view.updateCoords(lat, lng);
    });
  }

  #clearLocation() {
    this.#selectedLat = null;
    this.#selectedLng = null;
    this.#view.clearCoords();
    if (this.#clickableMarkerHandler) {
      this.#clickableMarkerHandler.clearMarker();
    }
  }

  async #handleSubmit() {
    const description = document.querySelector('#description')?.value.trim();

    this.#view.showFieldError('description', '');
    this.#view.showFieldError('photo', '');

    let valid = true;
    if (!description) {
      this.#view.showFieldError('description', 'Deskripsi cerita tidak boleh kosong.');
      valid = false;
    }
    if (!this.#selectedPhoto) {
      this.#view.showFieldError('photo', 'Harap pilih atau ambil foto cerita.');
      valid = false;
    } else if (this.#selectedPhoto.size > 1024 * 1024) {
      this.#view.showFieldError('photo', 'Ukuran foto maksimal adalah 1MB.');
      valid = false;
    }
    if (!valid) return;

    this.#view.setSubmitLoading(true);
    try {
      const payload = {
        description,
        photo: this.#selectedPhoto,
        ...(this.#selectedLat !== null && { lat: this.#selectedLat, lon: this.#selectedLng }),
      };
      const result = await addStory(payload);
      if (result.error) {
        showToast(result.message || 'Gagal mengirim cerita.', 'error');
      } else {
        showToast('Cerita berhasil diterbitkan!', 'success');
        this.#view.destroy();
        setTimeout(() => { window.location.hash = '#/'; }, 800);
      }
    } catch {
      showToast('Sinkronisasi server gagal.', 'error');
    } finally {
      this.#view.setSubmitLoading(false);
    }
  }
}

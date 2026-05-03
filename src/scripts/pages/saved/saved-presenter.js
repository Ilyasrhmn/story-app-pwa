import { createMap, addMarker, highlightMarker, createPopupContent } from '../../utils/map-helper';
import { showToast } from '../../utils/alert-helper';
import CONFIG from '../../config';
import DbHelper from '../../data/db-helper';

export default class SavedPresenter {
  #view;
  #map = null;
  #markers = {};
  #stories = [];

  constructor(view) {
    this.#view = view;
  }

  async init() {
    this.#view.showListLoading();
    this.#initMap();
    this.#view.bindStoryClick(this.#handleStoryClick.bind(this));
    this.#view.bindBookmarkClick(this.#handleBookmarkClick.bind(this));
    
    await this.#loadSavedStories();
  }

  async #loadSavedStories() {
    try {
      const savedStories = await DbHelper.getAllSavedStories();
      // Urutkan dari yang terbaru disimpan (berdasarkan ID atau asumsi ID berurutan)
      this.#stories = savedStories.reverse();
      this.#view.renderStories(this.#stories);
      if (this.#map) {
        this.#renderMarkers(this.#stories);
      }
    } catch (error) {
      console.error('Load saved stories failed:', error);
      this.#view.showListError('Gagal memuat cerita tersimpan.');
      showToast('Terjadi kesalahan saat membaca database lokal.', 'error');
    }
  }

  #initMap() {
    const mapEl = document.querySelector('#storiapp-main-map');
    if (!mapEl) return;

    this.#map = createMap('storiapp-main-map', {
      lat: CONFIG.DEFAULT_LAT,
      lng: CONFIG.DEFAULT_LNG,
      zoom: CONFIG.DEFAULT_ZOOM,
    });

    setTimeout(() => {
      if (this.#map) this.#map.invalidateSize();
    }, 100);

    this.#renderMarkers(this.#stories);
  }

  #renderMarkers(stories) {
    // Clear existing markers
    Object.values(this.#markers).forEach((marker) => marker.remove());
    this.#markers = {};

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const popup = createPopupContent(story);
        const marker = addMarker(this.#map, story.lat, story.lon, popup);
        marker.on('click', () => {
          this.#view.highlightStoryCard(story.id);
        });
        this.#markers[story.id] = marker;
      }
    });
  }

  #handleStoryClick(storyId) {
    this.#view.highlightStoryCard(storyId);
    const marker = this.#markers[storyId];
    if (marker && this.#map) {
      this.#map.setView(marker.getLatLng(), 14, { animate: true });
      highlightMarker(marker);
    }
  }

  async #handleBookmarkClick(storyId) {
    try {
      await DbHelper.deleteSavedStory(storyId);
      showToast('Dihapus dari cerita tersimpan', 'success');
      // Reload stories after deletion
      await this.#loadSavedStories();
    } catch (error) {
      console.error('Remove bookmark error:', error);
      showToast('Gagal menghapus cerita.', 'error');
    }
  }
}

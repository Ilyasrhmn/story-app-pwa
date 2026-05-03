import { getStories } from '../../data/api';
import { createMap, addMarker, highlightMarker, createPopupContent } from '../../utils/map-helper';
import { showToast } from '../../utils/alert-helper';
import CONFIG from '../../config';
import DbHelper from '../../data/db-helper';

export default class HomePresenter {
  #view;
  #map = null;
  #markers = {};
  #stories = [];
  #filteredStories = [];
  #isDescending = true;
  #searchKeyword = '';

  constructor(view) {
    this.#view = view;
  }

  async init() {
    this.#view.showListLoading();
    this.#initMap();
    this.#view.bindStoryClick(this.#handleStoryClick.bind(this));
    this.#view.bindSearch(this.#handleSearch.bind(this));
    this.#view.bindSort(this.#handleSortToggle.bind(this));
    this.#view.bindBookmarkClick(this.#handleBookmarkClick.bind(this));
    
    this.#loadStories().then(() => {
      this.#renderMarkers(this.#filteredStories);
    });
  }

  async #loadStories() {
    try {
      const result = await getStories({ size: 50, location: 1 });
      if (result.error) {
        this.#view.showListError('Gagal mengambil data cerita.');
        showToast(result.message || 'Terjadi kesalahan.', 'error');
        return;
      }
      this.#stories = result.listStory || [];
      this.#filteredStories = [...this.#stories];
      this.#applyInteractivity();
    } catch (error) {
      console.error('Load stories failed:', error);
      this.#view.showListError('Koneksi server gagal.');
      showToast('Periksa koneksi internet Anda.', 'error');
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

    this.#renderMarkers(this.#filteredStories);
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
      const isSaved = await DbHelper.getSavedStory(storyId);
      if (isSaved) {
        await DbHelper.deleteSavedStory(storyId);
        showToast('Dihapus dari cerita tersimpan', 'success');
      } else {
        const storyToSave = this.#stories.find(s => s.id === storyId);
        if (storyToSave) {
          await DbHelper.putSavedStory(storyToSave);
          showToast('Disimpan ke cerita tersimpan', 'success');
        }
      }
      this.#applyInteractivity();
    } catch (error) {
      console.error('Bookmark error:', error);
      showToast('Gagal mengubah status simpanan.', 'error');
    }
  }

  #handleSearch(keyword) {
    this.#searchKeyword = keyword.toLowerCase();
    this.#applyInteractivity();
  }

  #handleSortToggle() {
    this.#isDescending = !this.#isDescending;
    this.#view.updateSortIcon(this.#isDescending);
    this.#applyInteractivity();
  }

  #applyInteractivity() {
    // Filter
    this.#filteredStories = this.#stories.filter((story) => {
      const name = story.name.toLowerCase();
      const desc = story.description.toLowerCase();
      return name.includes(this.#searchKeyword) || desc.includes(this.#searchKeyword);
    });

    // Sort
    this.#filteredStories.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return this.#isDescending ? dateB - dateA : dateA - dateB;
    });

    this.#enrichAndRenderStories(this.#filteredStories);
    if (this.#map) {
      this.#renderMarkers(this.#filteredStories);
    }
  }

  async #enrichAndRenderStories(stories) {
    try {
      const savedStories = await DbHelper.getAllSavedStories();
      const savedIds = new Set(savedStories.map(s => s.id));
      const enrichedStories = stories.map(story => ({
        ...story,
        isSaved: savedIds.has(story.id)
      }));
      this.#view.renderStories(enrichedStories);
    } catch (error) {
      console.error('Failed to enrich stories:', error);
      this.#view.renderStories(stories);
    }
  }
}

import { showFormattedDate } from '../../utils/index';

export default class HomeView {
  render() {
    return `
      <section id="storiapp-home-section" class="relative flex flex-col md:flex-row h-[calc(100vh-60px)] md:h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
        <div id="storiapp-main-map"
          class="w-full md:flex-1 z-0 order-1 md:order-2 transition-all duration-500 ease-in-out
                 h-[calc(100vh-60px)] md:h-full"
          aria-label="Peta interaktif global" role="application"
        ></div>

        <aside id="storiapp-story-sidebar"
          class="w-full md:w-[420px] glass-panel md:m-4 md:rounded-3xl z-10 flex flex-col shadow-2xl order-2 md:order-1
                 md:h-[calc(100vh-112px)]
                 fixed md:static bottom-0 left-0 right-0
                 translate-y-full md:translate-y-0
                 transition-transform duration-500 ease-in-out
                 h-[60vh] overflow-hidden"
          aria-hidden="true"
        >
          <div class="flex flex-col h-full">
            <div class="p-4 md:p-8 border-b border-slate-100/50 bg-white/60 backdrop-blur-md sticky top-0 z-20 space-y-3">
              <div class="md:hidden flex justify-center -mt-1 mb-1" id="storiapp-panel-drag-handle">
                <div class="w-10 h-1 bg-slate-300 rounded-full"></div>
              </div>
              <div>
                <h1 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">Eksplorasi <span class="text-primary-600">Cerita</span></h1>
                <p class="text-slate-500 font-medium text-xs mt-1">Temukan pengalaman menarik dari seluruh dunia.</p>
              </div>
              
              <div class="flex items-center gap-2">
                <div class="relative flex-1 group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <input 
                    type="text" 
                    id="storiapp-search-stories" 
                    placeholder="Cari cerita..." 
                    class="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                    aria-label="Cari cerita"
                  />
                </div>
                <button id="storiapp-sort-toggle" class="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm" title="Urutkan Berdasarkan Waktu">
                  <i class="fa-solid fa-arrow-down-short-wide"></i>
                </button>
              </div>
            </div>
            
            <div id="storiapp-stories-list" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 hide-scrollbar scroll-smooth" aria-live="polite" aria-label="Daftar cerita">
            </div>

            <div class="p-4 bg-white/60 backdrop-blur-md border-t border-slate-100/50 text-center">
              <a href="#/add-story" class="btn-primary w-full py-3 text-sm rounded-2xl">
                  <i class="fa-solid fa-plus-circle"></i> Bagikan Ceritamu
              </a>
            </div>
          </div>
        </aside>

        <button
          id="storiapp-panel-fab"
          class="md:hidden fixed bottom-6 right-5 z-[500] w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl shadow-primary-600/40 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-primary-700"
          aria-label="Tampilkan daftar cerita"
        >
          <i class="fa-solid fa-magnifying-glass" id="storiapp-fab-icon"></i>
        </button>
      </section>
    `;
  }

  afterRender() {
    this.#initFabToggle();
  }

  #isPanelOpen = false;

  #initFabToggle() {
    const fab = document.querySelector('#storiapp-panel-fab');
    const sidebar = document.querySelector('#storiapp-story-sidebar');
    const map = document.querySelector('#storiapp-main-map');
    if (!fab || !sidebar || !map) return;

    fab.addEventListener('click', () => {
      this.#isPanelOpen = !this.#isPanelOpen;
      this.#applyPanelState(sidebar, map, fab);
    });

    // Swipe down to close panel
    let startY = 0;
    sidebar.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, { passive: true });
    sidebar.addEventListener('touchend', (e) => {
      const deltaY = e.changedTouches[0].clientY - startY;
      if (deltaY > 60 && this.#isPanelOpen) {
        this.#isPanelOpen = false;
        this.#applyPanelState(sidebar, map, fab);
      }
    }, { passive: true });
  }

  #applyPanelState(sidebar, map, fab) {
    const fabIcon = document.querySelector('#storiapp-fab-icon');
    if (this.#isPanelOpen) {
      sidebar.classList.remove('translate-y-full');
      sidebar.removeAttribute('aria-hidden');
      map.classList.remove('h-[calc(100vh-60px)]');
      map.classList.add('h-[40vh]');
      if (fabIcon) fabIcon.className = 'fa-solid fa-map';
      fab.setAttribute('aria-label', 'Kembali ke peta penuh');
      fab.classList.remove('bottom-6');
      fab.classList.add('bottom-[calc(60vh+1.5rem)]');
    } else {
      sidebar.classList.add('translate-y-full');
      sidebar.setAttribute('aria-hidden', 'true');
      map.classList.add('h-[calc(100vh-60px)]');
      map.classList.remove('h-[40vh]');
      if (fabIcon) fabIcon.className = 'fa-solid fa-magnifying-glass';
      fab.setAttribute('aria-label', 'Tampilkan daftar cerita');
      fab.classList.add('bottom-6');
      fab.classList.remove('bottom-[calc(60vh+1.5rem)]');
    }
  }

  renderStories(stories) {
    const container = document.querySelector('#storiapp-stories-list');
    if (!container) return;

    if (!stories || stories.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 text-slate-400">
          <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">
            <i class="fa-regular fa-folder-open"></i>
          </div>
          <p class="font-bold text-lg text-slate-600">Tidak ada cerita</p>
          <p class="text-sm">Coba kata kunci lain.</p>
        </div>`;
      return;
    }

    container.innerHTML = stories.map((story) => `
      <article class="story-card group" data-id="${story.id}" tabindex="0" role="button" aria-label="Cerita oleh ${story.name}">
        <div class="relative overflow-hidden rounded-[1.5rem] mb-4 shadow-sm group-hover:shadow-md transition-shadow aspect-video">
          <img src="${story.photoUrl}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Foto oleh ${story.name}" loading="lazy" />
          <div class="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl text-[9px] font-black text-primary-700 tracking-widest uppercase shadow-sm">
             ${story.lat ? 'Terdeteksi Lokasi' : 'Tanpa Lokasi'}
          </div>
          <button 
            class="bookmark-btn absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-lg text-primary-600 shadow-lg transition-transform hover:scale-110 active:scale-95" 
            data-id="${story.id}" 
            aria-label="${story.isSaved ? 'Hapus dari Tersimpan' : 'Simpan Cerita'}"
          >
            <i class="${story.isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
          </button>
        </div>
        
        <div class="space-y-2 px-1">
          <div class="flex items-center justify-between gap-4">
            <h2 class="font-black text-slate-900 group-hover:text-primary-600 transition-colors truncate">
              ${story.name}
            </h2>
            <span class="text-[10px] font-black text-slate-400 flex items-center gap-1.5 shrink-0 uppercase tracking-tighter">
              <i class="fa-regular fa-calendar text-primary-400"></i>
              ${showFormattedDate(story.createdAt)}
            </span>
          </div>
          <p class="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
            ${story.description}
          </p>
        </div>
      </article>
    `).join('');
  }

  bindSearch(handler) {
    const searchInput = document.querySelector('#storiapp-search-stories');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        handler(e.target.value.toLowerCase());
      });
    }
  }

  bindSort(handler) {
    const sortBtn = document.querySelector('#storiapp-sort-toggle');
    if (sortBtn) {
      sortBtn.addEventListener('click', () => {
        handler();
      });
    }
  }

  updateSortIcon(isDescending) {
    const icon = document.querySelector('#storiapp-sort-toggle i');
    if (icon) {
      icon.className = isDescending
        ? 'fa-solid fa-arrow-down-short-wide'
        : 'fa-solid fa-arrow-up-wide-short';
    }
  }

  bindStoryClick(handler) {
    const list = document.querySelector('#storiapp-stories-list');
    if (!list) return;
    list.addEventListener('click', (e) => {
      const bookmarkBtn = e.target.closest('.bookmark-btn');
      if (bookmarkBtn) return; // Abaikan jika yang diklik adalah tombol bookmark
      
      const card = e.target.closest('.story-card');
      if (card) handler(card.dataset.id);
    });
    list.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.story-card');
        if (card) { e.preventDefault(); handler(card.dataset.id); }
      }
    });
  }

  highlightStoryCard(storyId) {
    document.querySelectorAll('.story-card').forEach((card) => {
      const isActive = card.dataset.id === storyId;
      card.classList.toggle('active', isActive);
      if (isActive) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  bindBookmarkClick(handler) {
    const list = document.querySelector('#storiapp-stories-list');
    if (!list) return;
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.bookmark-btn');
      if (btn) {
        e.stopPropagation();
        handler(btn.dataset.id);
      }
    });
  }

  showListLoading() {
    const container = document.querySelector('#storiapp-stories-list');
    if (container) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 text-slate-400">
           <div class="animate-spin h-10 w-10 border-4 border-slate-200 border-t-primary-600 rounded-full mb-4"></div>
           <p class="font-black text-xs uppercase tracking-widest">Sinkronisasi...</p>
        </div>`;
    }
  }

  showListError(message) {
    const container = document.querySelector('#storiapp-stories-list');
    if (container) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-10 text-rose-500 bg-rose-50/30 rounded-3xl m-4 p-8 text-center border border-rose-100">
          <i class="fa-solid fa-triangle-exclamation text-3xl mb-4"></i>
          <p class="font-black text-sm uppercase">Koneksi Gagal</p>
          <p class="text-xs font-medium opacity-70 mt-1">${message}</p>
          <button onclick="window.location.reload()" class="mt-6 btn-secondary py-2 px-6 text-xs bg-white">Coba Lagi</button>
        </div>`;
    }
  }
}

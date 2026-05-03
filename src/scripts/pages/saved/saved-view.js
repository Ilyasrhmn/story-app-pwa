import { showFormattedDate } from '../../utils/index';

export default class SavedView {
  render() {
    return `
      <section class="flex flex-col md:flex-row h-[calc(100vh-60px)] md:h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
        <!-- Peta Utama -->
        <div id="storiapp-main-map" class="w-full md:flex-1 h-[40vh] md:h-full z-0 order-1 md:order-2" aria-label="Peta lokasi cerita tersimpan" role="application"></div>

        <!-- Panel Cerita Tersimpan -->
        <aside id="storiapp-story-sidebar" class="w-full md:w-[420px] glass-panel md:m-4 md:rounded-3xl z-10 flex flex-col shadow-2xl order-2 md:order-1 h-[60vh] md:h-[calc(100vh-112px)] overflow-hidden">
          <div class="flex flex-col h-full">
            <div class="p-4 md:p-8 border-b border-slate-100/50 bg-white/60 backdrop-blur-md sticky top-0 z-20 space-y-3">
              <!-- Drag handle visual (mobile) -->
              <div class="md:hidden flex justify-center -mt-1 mb-1">
                <div class="w-10 h-1 bg-slate-300 rounded-full"></div>
              </div>
              <div>
                <h1 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">Cerita <span class="text-primary-600">Tersimpan</span></h1>
                <p class="text-slate-500 font-medium text-xs mt-1">Daftar cerita yang Anda simpan secara offline.</p>
              </div>
            </div>
            
            <div id="storiapp-stories-list" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 hide-scrollbar scroll-smooth" aria-live="polite" aria-label="Daftar cerita tersimpan">
              <!-- Konten cerita akan dimuat secara dinamis -->
            </div>
          </div>
        </aside>
      </section>
    `;
  }

  afterRender() {
    // Layout now uses CSS flex order - no JS teleport needed
  }

  renderStories(stories) {
    const container = document.querySelector('#storiapp-stories-list');
    if (!container) return;

    if (!stories || stories.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 text-slate-400">
          <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4">
            <i class="fa-solid fa-bookmark"></i>
          </div>
          <p class="font-bold text-lg text-slate-600">Belum ada cerita tersimpan</p>
          <p class="text-sm">Simpan cerita di beranda untuk melihatnya di sini.</p>
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
            aria-label="Hapus dari Tersimpan"
          >
            <i class="fa-solid fa-bookmark"></i>
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
        if (card) {
          e.preventDefault();
          handler(card.dataset.id);
        }
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

  highlightStoryCard(storyId) {
    document.querySelectorAll('.story-card').forEach((card) => {
      if (card.dataset.id === storyId) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        card.classList.remove('active');
      }
    });
  }

  showListLoading() {
    const container = document.querySelector('#storiapp-stories-list');
    if (container) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 text-slate-400">
          <div class="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p class="font-bold text-sm tracking-widest uppercase">Memuat Cerita...</p>
        </div>
      `;
    }
  }

  showListError(message) {
    const container = document.querySelector('#storiapp-stories-list');
    if (container) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 text-rose-500">
          <i class="fa-solid fa-triangle-exclamation text-3xl mb-4"></i>
          <p class="font-bold text-sm text-center px-4">${message}</p>
        </div>
      `;
    }
  }
}

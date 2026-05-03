export default class AddStoryView {
  #cameraStream = null;

  render() {
    return `
      <section class="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div class="mb-10 text-center md:text-left">
          <h1 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-3 uppercase">
            Terbitkan <span class="text-primary-600">Cerita Baru</span>
          </h1>
          <p class="text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto md:mx-0">
            Bagikan pengalaman terbarumu dengan komunitas global. Tandai lokasimu dan abadikan momen berharga.
          </p>
        </div>

        <form id="storiapp-add-story-form" class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start" novalidate>
          <!-- Left Column: Form Content -->
          <div class="lg:col-span-7 space-y-8">
            <div class="glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40">
              <div class="space-y-8">
                <!-- Description Field -->
                <div>
                  <h2 class="text-lg font-black text-slate-800 flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center text-sm">
                      <i class="fa-solid fa-feather-pointed"></i>
                    </div>
                    <label for="description">Pengalaman Anda</label>
                  </h2>
                  <textarea
                    id="description"
                    name="description"
                    rows="6"
                    class="input-field text-lg resize-none"
                    placeholder="Tuliskan inti dari perjalanan Anda di sini..."
                    required
                  ></textarea>
                  <p id="description-error" class="hidden mt-3 text-sm font-bold text-rose-500 flex items-center gap-2 px-2">
                    <i class="fa-solid fa-circle-exclamation"></i> <span class="error-text"></span>
                  </p>
                </div>

                <!-- Visual Media Section -->
                <div class="pt-8 border-t border-slate-100">
                  <h2 class="text-lg font-black text-slate-800 flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-sm">
                      <i class="fa-solid fa-camera-retro"></i>
                    </div>
                    Visual Cerita
                  </h2>
                  
                  <!-- Toggle Tabs -->
                  <div class="flex p-1.5 bg-slate-100/50 rounded-2xl mb-8">
                    <button type="button" id="storiapp-tab-upload" class="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all bg-white text-primary-600 shadow-sm ring-1 ring-slate-200">
                      <i class="fa-solid fa-cloud-arrow-up mr-2"></i> Unggah Lokal
                    </button>
                    <button type="button" id="storiapp-tab-camera" class="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all text-slate-500 hover:text-slate-700">
                      <i class="fa-solid fa-video mr-2"></i> Ambil Foto
                    </button>
                  </div>

                  <!-- Upload Panel -->
                  <div id="storiapp-panel-upload" class="space-y-4">
                    <label for="photo-file" id="storiapp-drop-zone" class="flex flex-col items-center justify-center p-12 md:p-16 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all group bg-slate-50/10">
                      <div class="w-16 h-16 md:w-20 md:h-20 bg-white shadow-sm group-hover:bg-primary-100 text-slate-400 group-hover:text-primary-600 rounded-2xl flex items-center justify-center text-3xl transition-all mb-6">
                        <i class="fa-solid fa-images"></i>
                      </div>
                      <span class="text-lg md:text-xl font-black text-slate-800 group-hover:text-primary-800">Pilih visual cerita</span>
                      <span class="text-sm text-slate-400 mt-2 font-medium">JPG, PNG atau WEBP  Maks 1MB</span>
                      <input type="file" id="photo-file" name="photo" accept="image/*" class="hidden" required />
                    </label>
                    
                    <div id="storiapp-upload-preview" class="hidden relative rounded-3xl overflow-hidden shadow-2xl aspect-video group">
                      <img id="storiapp-upload-preview-img" src="" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Pratinjau gambar" />
                      <button type="button" id="storiapp-remove-upload" class="absolute top-4 right-4 md:top-6 md:right-6 bg-rose-500 hover:bg-rose-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center gap-2">
                        <i class="fa-solid fa-trash-can"></i> Hapus
                      </button>
                    </div>
                  </div>

                  <!-- Camera Panel -->
                  <div id="storiapp-panel-camera" class="hidden space-y-6">
                    <div class="relative bg-slate-900 rounded-3xl overflow-hidden aspect-video shadow-inner ring-4 ring-slate-100">
                      <video id="storiapp-camera-video" class="w-full h-full object-cover" autoplay playsinline muted></video>
                      <canvas id="storiapp-camera-canvas" class="hidden"></canvas>
                      <div id="storiapp-camera-preview" class="hidden w-full h-full">
                        <img id="storiapp-camera-preview-img" src="" class="w-full h-full object-cover" alt="Pratinjau kamera" />
                      </div>
                    </div>
                    <div class="flex gap-4">
                      <button type="button" id="storiapp-start-camera-btn" class="btn-secondary flex-1 py-4">
                        <i class="fa-solid fa-power-off"></i> Aktifkan Kamera
                      </button>
                      <button type="button" id="storiapp-capture-btn" class="btn-primary flex-1 py-4 hidden">
                        <i class="fa-solid fa-circle-dot"></i> Tangkap
                      </button>
                      <button type="button" id="storiapp-remove-capture" class="btn-secondary flex-1 py-4 hidden">
                        <i class="fa-solid fa-rotate-right"></i> Ambil Ulang
                      </button>
                    </div>
                  </div>
                  
                  <p id="photo-error" class="hidden mt-3 text-sm font-bold text-rose-500 flex items-center gap-2 px-2">
                    <i class="fa-solid fa-circle-exclamation"></i> <span class="error-text"></span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 mt-4">
              <button type="submit" id="storiapp-submit-btn" class="btn-primary flex-[2] py-5 text-lg md:text-xl shadow-2xl shadow-primary-600/30 uppercase tracking-widest font-black">
                <span class="btn-text">Terbitkan Cerita</span>
                <div class="animate-spin h-6 w-6 border-3 border-white/30 border-t-white rounded-full hidden" id="storiapp-loader"></div>
              </button>
              <button type="button" id="storiapp-cancel-btn" class="btn-secondary flex-1 py-5 bg-white shadow-md font-bold">
                Batal
              </button>
            </div>
          </div>

          <div class="lg:col-span-5 lg:sticky lg:top-28">
            <div class="glass-panel p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40 flex flex-col gap-6">
              <h2 class="text-lg font-black text-slate-800 flex items-center gap-3">
                <div class="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center text-sm">
                  <i class="fa-solid fa-location-crosshairs"></i>
                </div>
                Lokasi Geografis
              </h2>
              
              <div id="storiapp-add-story-map" class="w-full min-h-[300px] md:min-h-[400px] rounded-2xl md:rounded-[2rem] border border-slate-100 overflow-hidden shadow-inner z-0"></div>
              
              <div class="p-4 md:p-6 bg-slate-50/50 rounded-2xl space-y-4 border border-slate-100">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Koordinat Digital</span>
                  <button type="button" id="storiapp-clear-coords" class="hidden text-[10px] font-bold text-rose-500 hover:text-rose-600 underline">Reset</button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-white p-3 rounded-xl border border-slate-200 flex flex-col shadow-sm">
                    <span class="text-[9px] font-bold text-slate-400 uppercase mb-1">Lat</span>
                    <span id="storiapp-coord-lat" class="text-primary-600 font-black text-sm tracking-tight truncate">-</span>
                  </div>
                  <div class="bg-white p-3 rounded-xl border border-slate-200 flex flex-col shadow-sm">
                    <span class="text-[9px] font-bold text-slate-400 uppercase mb-1">Lng</span>
                    <span id="storiapp-coord-lng" class="text-primary-600 font-black text-sm tracking-tight truncate">-</span>
                  </div>
                </div>
              </div>
              <p class="text-[10px] text-slate-400 text-center font-bold opacity-70 leading-relaxed">
                <i class="fa-solid fa-circle-info mr-1"></i> Ketuk peta untuk memilih titik asal cerita atau bagikan tanpa lokasi.
              </p>
            </div>
          </div>
        </form>
      </section>
    `;
  }

  bindTabSwitch() {
    const tabUpload = document.querySelector('#storiapp-tab-upload');
    const tabCamera = document.querySelector('#storiapp-tab-camera');
    const panelUpload = document.querySelector('#storiapp-panel-upload');
    const panelCamera = document.querySelector('#storiapp-panel-camera');

    if (!tabUpload || !tabCamera) return;

    const setTabState = (active, inactive) => {
      active.classList.add('bg-white', 'text-primary-600', 'shadow-sm', 'ring-1', 'ring-slate-200');
      active.classList.remove('text-slate-500', 'hover:text-slate-700');
      inactive.classList.remove('bg-white', 'text-primary-600', 'shadow-sm', 'ring-1', 'ring-slate-200');
      inactive.classList.add('text-slate-500', 'hover:text-slate-700');
    };

    tabUpload.addEventListener('click', () => {
      setTabState(tabUpload, tabCamera);
      panelUpload?.classList.remove('hidden');
      panelCamera?.classList.add('hidden');
      this.stopCamera();
    });

    tabCamera.addEventListener('click', () => {
      setTabState(tabCamera, tabUpload);
      panelCamera?.classList.remove('hidden');
      panelUpload?.classList.add('hidden');
    });
  }

  bindFileUpload(onFileSelected) {
    const fileInput  = document.querySelector('#photo-file');
    const dropZone   = document.querySelector('#storiapp-drop-zone');
    const preview    = document.querySelector('#storiapp-upload-preview');
    const previewImg = document.querySelector('#storiapp-upload-preview-img');
    const removeBtn  = document.querySelector('#storiapp-remove-upload');

    if (!fileInput) return;

    const showPreview = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (previewImg) previewImg.src = e.target.result;
        preview?.classList.remove('hidden');
        dropZone?.classList.add('hidden');
      };
      reader.readAsDataURL(file);
      onFileSelected(file);
    };

    fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) showPreview(e.target.files[0]);
    });

    removeBtn?.addEventListener('click', () => {
      fileInput.value = '';
      preview?.classList.add('hidden');
      dropZone?.classList.remove('hidden');
      onFileSelected(null);
    });
  }

  async bindCamera(onPhotoCapture) {
    const startBtn      = document.querySelector('#storiapp-start-camera-btn');
    const captureBtn    = document.querySelector('#storiapp-capture-btn');
    const removeBtn     = document.querySelector('#storiapp-remove-capture');
    const video         = document.querySelector('#storiapp-camera-video');
    const canvas        = document.querySelector('#storiapp-camera-canvas');
    const previewPanel  = document.querySelector('#storiapp-camera-preview');
    const previewImg    = document.querySelector('#storiapp-camera-preview-img');

    if (!startBtn) return;

    startBtn.addEventListener('click', async () => {
      try {
        this.#cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (video) video.srcObject = this.#cameraStream;
        video?.classList.remove('hidden');
        previewPanel?.classList.add('hidden');
        startBtn.classList.add('hidden');
        captureBtn?.classList.remove('hidden');
        removeBtn?.classList.add('hidden');
      } catch (err) {
        const { showToast } = await import('../../utils/alert-helper');
        showToast('Akses kamera ditolak.', 'error');
      }
    });

    captureBtn?.addEventListener('click', () => {
      if (!video || !canvas) return;
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      if (previewImg) previewImg.src = dataUrl;
      previewPanel?.classList.remove('hidden');
      video.classList.add('hidden');
      captureBtn.classList.add('hidden');
      removeBtn?.classList.remove('hidden');

      canvas.toBlob((blob) => {
        const file = new File([blob], 'story-capture.jpg', { type: 'image/jpeg' });
        onPhotoCapture(file);
      }, 'image/jpeg', 0.9);

      this.stopCamera();
    });

    removeBtn?.addEventListener('click', async () => {
      previewPanel?.classList.add('hidden');
      video?.classList.remove('hidden');
      captureBtn?.classList.remove('hidden');
      removeBtn.classList.add('hidden');
      onPhotoCapture(null);
      await this.startCamera();
    });
  }

  async startCamera() {
    const video = document.querySelector('#storiapp-camera-video');
    if (!video) return;
    try {
      this.#cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      video.srcObject = this.#cameraStream;
    } catch { }
  }

  stopCamera() {
    if (this.#cameraStream) {
      this.#cameraStream.getTracks().forEach((track) => track.stop());
      this.#cameraStream = null;
    }
  }

  updateCoords(lat, lng) {
    const latEl    = document.querySelector('#storiapp-coord-lat');
    const lngEl    = document.querySelector('#storiapp-coord-lng');
    const clearBtn = document.querySelector('#storiapp-clear-coords');
    if (latEl)    latEl.textContent = lat.toFixed(6);
    if (lngEl)    lngEl.textContent = lng.toFixed(6);
    if (clearBtn) clearBtn.classList.remove('hidden');
  }

  clearCoords() {
    const latEl    = document.querySelector('#storiapp-coord-lat');
    const lngEl    = document.querySelector('#storiapp-coord-lng');
    const clearBtn = document.querySelector('#storiapp-clear-coords');
    if (latEl)    latEl.textContent = '-';
    if (lngEl)    lngEl.textContent = '-';
    if (clearBtn) clearBtn.classList.add('hidden');
  }

  showFieldError(fieldId, message) {
    const errorEl = document.querySelector(`#${fieldId}-error`);
    const inputEl = document.querySelector(`#${fieldId}`);
    if (errorEl) {
      const textSpan = errorEl.querySelector('.error-text');
      if (textSpan) textSpan.textContent = message;
      errorEl.classList.toggle('hidden', !message);
    }
    if (inputEl) {
      inputEl.classList.toggle('border-rose-500', !!message);
      inputEl.classList.toggle('ring-rose-500/10', !!message);
    }
  }

  setSubmitLoading(isLoading) {
    const btn = document.querySelector('#storiapp-submit-btn');
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const loader = document.querySelector('#storiapp-loader');
    btn.disabled = isLoading;
    text?.classList.toggle('hidden', isLoading);
    loader?.classList.toggle('hidden', !isLoading);
  }

  bindFormSubmit(handler) {
    const form = document.querySelector('#storiapp-add-story-form');
    form?.addEventListener('submit', (e) => { e.preventDefault(); handler(); });
  }

  bindCancel(handler) {
    const btn = document.querySelector('#storiapp-cancel-btn');
    btn?.addEventListener('click', handler);
  }

  bindClearCoords(handler) {
    const btn = document.querySelector('#storiapp-clear-coords');
    btn?.addEventListener('click', handler);
  }

  afterRender() {}

  destroy() { this.stopCamera(); }
}



import L from 'leaflet';
import CONFIG from '../config';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const TILE_LAYERS = {
  'Peta Standar': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }),
  'Mode Gelap': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  }),
  'Citra Satelit': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
    maxZoom: 19,
  }),
};

export function createMap(containerId, options = {}) {
  const map = L.map(containerId, {
    center: [options.lat || CONFIG.DEFAULT_LAT, options.lng || CONFIG.DEFAULT_LNG],
    zoom: options.zoom || CONFIG.DEFAULT_ZOOM,
    layers: [TILE_LAYERS['Peta Standar']],
  });

  L.control.layers(TILE_LAYERS).addTo(map);

  return map;
}

export function addMarker(map, lat, lng, popupContent) {
  const marker = L.marker([lat, lng]).addTo(map);
  if (popupContent) {
    marker.bindPopup(popupContent);
  }
  return marker;
}

export function addClickableMarker(map, onClickCallback) {
  let tempMarker = null;

  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    if (tempMarker) {
      map.removeLayer(tempMarker);
    }
    tempMarker = L.marker([lat, lng]).addTo(map);
    tempMarker.bindPopup(`<b>Koordinat Terpilih</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`).openPopup();
    onClickCallback(lat, lng);
  });

  return {
    clearMarker() {
      if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
      }
    },
  };
}

export function highlightMarker(marker) {
  marker.setZIndexOffset(1000);
  marker.openPopup();
}

export function createPopupContent(story) {
  return `
    <div class="min-w-[200px] font-sans p-1">
      <img src="${story.photoUrl}" alt="${story.name}" class="w-full h-28 object-cover rounded-lg mb-3" loading="lazy" />
      <p class="font-black text-xs text-primary-600 uppercase mb-1">${story.name}</p>
      <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">${story.description}</p>
    </div>
  `;
}

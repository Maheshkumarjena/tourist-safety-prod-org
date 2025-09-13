import axios from 'axios';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/reverse';
const cache = new Map<string, string>();

export async function reverseGeocode(lat: number, lng: number) {
  const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  if (cache.has(key)) return cache.get(key) as string;

  try {
    const res = await axios.get(NOMINATIM_BASE, {
      params: {
        lat,
        lon: lng,
        format: 'jsonv2',
        addressdetails: 1,
      },
      headers: { 'Accept-Language': 'en' }
    });

    const display = res.data?.display_name || '';
    const name = display || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    cache.set(key, name);
    return name;
  } catch (e) {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

import LZString from 'lz-string';
import { TravelAppData } from '../types';

/**
 * Generate a shareable URL containing the full trip data compressed in the URL hash.
 * This requires ZERO backend, ZERO database, ZERO tokens, and is 100% free!
 */
export function generateShareableUrl(data: TravelAppData): string {
  try {
    const jsonStr = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(jsonStr);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#shared_trip=${compressed}`;
  } catch (err) {
    console.error('Failed to generate shareable URL:', err);
    return window.location.href;
  }
}

/**
 * Parse shared trip data from URL hash if present
 */
export function parseShareableUrl(): TravelAppData | null {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('#shared_trip=')) {
      // Also check URL search params as fallback
      const searchParams = new URLSearchParams(window.location.search);
      const paramData = searchParams.get('shared_trip');
      if (paramData) {
        const decompressed = LZString.decompressFromEncodedURIComponent(paramData);
        if (decompressed) {
          return JSON.parse(decompressed);
        }
      }
      return null;
    }

    const encodedData = hash.replace('#shared_trip=', '');
    if (!encodedData) return null;

    const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);
    if (parsed && parsed.tripTitle && Array.isArray(parsed.days)) {
      return parsed as TravelAppData;
    }
    return null;
  } catch (err) {
    console.error('Failed to parse shareable URL:', err);
    return null;
  }
}

/**
 * Shorten a long URL via backend /api/shorten
 */
export async function shortenUrl(longUrl: string): Promise<string> {
  try {
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: longUrl }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.shortUrl) {
        return data.shortUrl;
      }
    }
  } catch (err) {
    console.warn('Failed to call shorten API:', err);
  }
  return longUrl;
}

/**
 * Clear share hash from current URL without reloading page
 */
export function clearShareUrlHash() {
  if (window.location.hash && window.location.hash.includes('#shared_trip=')) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

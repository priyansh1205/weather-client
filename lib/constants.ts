export const API_ENDPOINTS = {
  WEATHER: '/api/weather',
  GEO: '/api/geo',
} as const;

export const QUERY_KEYS = {
  WEATHER_BY_CITY: 'weather-city',
  WEATHER_BY_COORDS: 'weather-coords',
  CITY_SUGGESTIONS: 'city-suggestions',
} as const;

export const DEFAULT_CITY = 'Bengaluru';
export const DEBOUNCE_DELAY = 500;
export const MIN_SEARCH_LENGTH = 3;
export const STALE_TIME = {
  WEATHER: 5 * 60 * 1000, // 5 minutes
  SUGGESTIONS: 24 * 60 * 60 * 1000, // 24 hours
} as const;

import { WeatherData, CitySuggestion, WeatherQuery } from '@/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from '../constants';

export async function fetchWeatherData(query: WeatherQuery): Promise<WeatherData> {
  const params = new URLSearchParams();

  if (query.type === 'city') {
    params.append('city', query.value);
  } else {
    params.append('lat', query.lat.toString());
    params.append('lon', query.lon.toString());
  }

  return apiClient<WeatherData>(
    `${API_ENDPOINTS.WEATHER}?${params.toString()}`
  );
}

export async function fetchCitySuggestions(
  query: string
): Promise<CitySuggestion[]> {
  if (query.length < 3) {
    return [];
  }

  return apiClient<CitySuggestion[]>(
    `${API_ENDPOINTS.GEO}?q=${encodeURIComponent(query)}`
  );
}

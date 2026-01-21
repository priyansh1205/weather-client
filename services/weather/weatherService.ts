import { WeatherApiResponse } from './types';
import { ExternalApiError, ValidationError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

type WeatherQueryParams =
  | { type: 'city'; value: string }
  | { type: 'coords'; lat: number; lon: number };

export class WeatherService {
  private buildUrl(query: WeatherQueryParams): string {
    if (!API_KEY) {
      throw new ValidationError('API key not configured');
    }

    const params = new URLSearchParams({
      appid: API_KEY,
      units: 'metric',
    });

    if (query.type === 'city') {
      params.append('q', query.value);
    } else {
      params.append('lat', query.lat.toString());
      params.append('lon', query.lon.toString());
    }

    return `${BASE_URL}?${params.toString()}`;
  }

  async getWeatherData(query: WeatherQueryParams): Promise<WeatherApiResponse> {
    try {
      const url = this.buildUrl(query);
      logger.debug('Fetching weather data:', { query });

      const response = await fetch(url, {
        next: { revalidate: 300 },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ExternalApiError(
          data.message || 'Weather API request failed',
          response.status,
          { query, response: data }
        );
      }

      return data as WeatherApiResponse;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ExternalApiError) {
        throw error;
      }

      logger.error('Weather service error:', error);
      throw new ExternalApiError('Failed to fetch weather data');
    }
  }
}

export const weatherService = new WeatherService();

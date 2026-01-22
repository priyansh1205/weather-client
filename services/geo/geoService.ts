import { ExternalApiError, ValidationError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { GeoLocation } from './types';
import { ServerConstants } from '@/lib/constants';


export class GeocodingService {
  private buildUrl(query: string, limit: number = 5): string {
    if (!ServerConstants.API_KEY) {
      throw new ValidationError('API key not configured');
    }

    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      appid: ServerConstants.API_KEY,
    });

    return `${ServerConstants.GEO_BASE_URL}?${params.toString()}`;
  }

  async getLocations(query: string, limit?: number): Promise<GeoLocation[]> {
    try {
      if (!query.trim()) {
        throw new ValidationError('Query parameter is required');
      }

      const url = this.buildUrl(query, limit);
      logger.debug('Fetching geocoding data:', { query });

      const response = await fetch(url, {
        next: { revalidate: 86400 }, 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ExternalApiError(
          data.message || 'Geocoding API request failed',
          response.status,
          { query, response: data }
        );
      }

      return data as GeoLocation[];
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ExternalApiError) {
        throw error;
      }

      logger.error('Geocoding service error:', error);
      throw new ExternalApiError('Failed to fetch location data');
    }
  }
}

export const geocodingService = new GeocodingService();
import { NextRequest } from 'next/server';
import { handleApiError, ValidationError, ExternalApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('q');

    if (!query) {
      throw new ValidationError('Query parameter "q" is required');
    }

    if (!API_KEY) {
      logger.error('OpenWeatherMap API key not configured');
      throw new ValidationError('Server configuration error');
    }

    const url = `${GEO_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new ExternalApiError(
        'Geocoding API request failed',
        response.status
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

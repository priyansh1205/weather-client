import { NextRequest } from 'next/server';
import { weatherService } from '@/services/weather';
import { handleApiError } from '@/lib/errors';
import { ValidationError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    let data;

    if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new ValidationError('Invalid coordinates');
      }

      data = await weatherService.getWeatherData({
        type: 'coords',
        lat: latitude,
        lon: longitude,
      });
    } else if (city) {
      data = await weatherService.getWeatherData({
        type: 'city',
        value: city,
      });
    } else {
      throw new ValidationError('Missing city or coordinates');
    }

    return Response.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

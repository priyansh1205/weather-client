import { NextRequest } from 'next/server';
import { handleApiError } from '@/lib/errors';
import { geocodingService } from '@/services/geo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('q');

    const locations = await geocodingService.getLocations(query || '');

    return Response.json(locations);
  } catch (error) {
    return handleApiError(error);
  }
}
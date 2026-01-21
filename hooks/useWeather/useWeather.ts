import { useQuery } from '@tanstack/react-query';
import { WeatherData, WeatherQuery } from '@/types';
import { fetchWeatherData } from '@/lib/api/endpoints';
import { QUERY_KEYS, STALE_TIME } from '@/lib/constants';

export function useWeather(query: WeatherQuery) {
  const queryKey =
    query.type === 'city'
      ? [QUERY_KEYS.WEATHER_BY_CITY, query.value]
      : [QUERY_KEYS.WEATHER_BY_COORDS, query.lat, query.lon];

  return useQuery<WeatherData, Error>({
    queryKey,
    queryFn: () => fetchWeatherData(query),
    staleTime: STALE_TIME.WEATHER,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

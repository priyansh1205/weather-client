'use client';

import { useState, useEffect } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { WeatherQuery } from '@/types';
import { WeatherSearch } from '@/components/features/weather/WeatherSearch';
import { WeatherCard } from '@/components/features/weather/WeatherCard';
import { MapPin } from 'lucide-react';
import { DEFAULT_CITY } from '@/lib/constants';

export default function WeatherPage() {
  const [query, setQuery] = useState<WeatherQuery>({
    type: 'city',
    value: DEFAULT_CITY,
  });
  const location = useGeolocation();
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if (location.loaded) {
      if (location.coordinates) {
        setQuery({
          type: 'coords',
          lat: location.coordinates.lat,
          lon: location.coordinates.lon,
        });
      }
      setIsLocating(false);
    }
  }, [location.loaded, location.coordinates]);

  const { data, isLoading, error, isError } = useWeather(query);

  const handleCitySelect = (city: string) => {
    setQuery({ type: 'city', value: city });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-slate-50">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900">
          Weather App
        </h1>

        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm h-6">
          {isLocating ? (
            <span className="animate-pulse">Detecting location...</span>
          ) : query.type === 'coords' ? (
            <span className="flex items-center gap-1 text-green-600">
              <MapPin className="w-3 h-3" /> Using your location
            </span>
          ) : (
            <span>Viewing city: {query.value}</span>
          )}
        </div>
      </div>

      <div className="w-full max-w-sm relative z-50">
        <WeatherSearch onCitySelect={handleCitySelect} isLoading={isLoading} />
      </div>

      <div className="relative z-0 w-full flex justify-center">
        {(isLoading || isLocating) && (
          <div className="mt-10 animate-pulse w-full max-w-sm h-64 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
            Loading Weather...
          </div>
        )}

        {isError && !isLocating && (
          <div className="mt-6 p-4 w-full max-w-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center shadow-sm">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error?.message}</p>
          </div>
        )}

        {data && !isLoading && !isLocating && <WeatherCard data={data} />}
      </div>
    </main>
  );
}

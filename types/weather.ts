export interface WeatherData {
  name: string;
  coord: {
    lon: number;
    lat: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
}

export interface CitySuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export type WeatherQuery =
  | { type: 'city'; value: string }
  | { type: 'coords'; lat: number; lon: number };

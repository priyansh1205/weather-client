export interface WeatherApiResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind?: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

export type WeatherQueryParams =
  | { type: 'city'; value: string }
  | { type: 'coords'; lat: number; lon: number };
import { WeatherData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Thermometer,
  CloudRain,
  Navigation,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface WeatherCardProps {
  data: WeatherData;
}

function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function WeatherCard({ data }: WeatherCardProps) {
  const sunriseTime = formatTime(data.sys.sunrise, data.timezone);
  const sunsetTime = formatTime(data.sys.sunset, data.timezone);
  const windDirection = getWindDirection(data.wind.deg);

  return (
    <Card className="w-full max-w-2xl mt-6" data-testid="weather-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          {data.name}, {data.sys.country}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          {/* Main Temperature Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
                alt={data.weather[0].description}
                width={120}
                height={120}
                className="w-28 h-28"
              />
              <div className="flex flex-col items-center">
                <span className="text-7xl font-extrabold tracking-tighter">
                  {Math.round(data.main.temp)}°
                </span>
                <p className="text-muted-foreground capitalize text-lg mt-1">
                  {data.weather[0].description}
                </p>
              </div>
            </div>

            {/* Feels Like & Min/Max */}
            <div className="flex gap-6 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Thermometer className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Feels like</span>
                <span className="font-semibold">{Math.round(data.main.feels_like)}°</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3 text-red-500" />
                  <span className="font-semibold">{Math.round(data.main.temp_max)}°</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowDown className="w-3 h-3 text-blue-500" />
                  <span className="font-semibold">{Math.round(data.main.temp_min)}°</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Humidity */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Humidity</span>
                <span className="text-lg font-semibold">{data.main.humidity}%</span>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Wind className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Wind Speed</span>
                <span className="text-lg font-semibold">
                  {data.wind.speed} m/s
                </span>
              </div>
            </div>

            {/* Wind Direction */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Navigation
                  className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  style={{ transform: `rotate(${data.wind.deg}deg)` }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Direction</span>
                <span className="text-lg font-semibold">
                  {windDirection} ({data.wind.deg}°)
                </span>
              </div>
            </div>

            {/* Pressure */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Gauge className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Pressure</span>
                <span className="text-lg font-semibold">{data.main.pressure} hPa</span>
              </div>
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                <Eye className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Visibility</span>
                <span className="text-lg font-semibold">
                  {(data.visibility / 1000).toFixed(1)} km
                </span>
              </div>
            </div>

            {/* Cloud Coverage */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <CloudRain className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Clouds</span>
                <span className="text-lg font-semibold">{data.clouds.all}%</span>
              </div>
            </div>
          </div>

          {/* Sunrise & Sunset */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Sunrise className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Sunrise</span>
                <span className="text-lg font-semibold">{sunriseTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Sunset className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Sunset</span>
                <span className="text-lg font-semibold">{sunsetTime}</span>
              </div>
            </div>
          </div>

          {/* Optional: Wind Gust */}
          {data.wind.gust && (
            <div className="text-xs text-center text-muted-foreground">
              Wind gusts up to {data.wind.gust} m/s
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

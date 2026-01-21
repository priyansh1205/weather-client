import { weatherService } from './weatherService';
import { ExternalApiError, ValidationError } from '@/lib/errors';

describe('WeatherService', () => {
  const originalApiKey = process.env.OPENWEATHERMAP_API_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENWEATHERMAP_API_KEY = 'test-api-key';
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    process.env.OPENWEATHERMAP_API_KEY = originalApiKey;
  });

  describe('getWeatherData', () => {
    it('should fetch weather data by city', async () => {
      const mockResponse = {
        name: 'London',
        main: {
          temp: 20,
          humidity: 65,
          feels_like: 19,
          temp_min: 18,
          temp_max: 22,
        },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        sys: { country: 'GB' },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await weatherService.getWeatherData({
        type: 'city',
        value: 'London',
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=London'),
        expect.any(Object)
      );
    });

    it('should fetch weather data by coordinates', async () => {
      const mockResponse = {
        name: 'Bengaluru',
        main: {
          temp: 25,
          humidity: 70,
          feels_like: 26,
          temp_min: 24,
          temp_max: 27,
        },
        weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
        sys: { country: 'IN' },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await weatherService.getWeatherData({
        type: 'coords',
        lat: 12.9716,
        lon: 77.5946,
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('lat=12.9716'),
        expect.any(Object)
      );
    });

    it('should throw ExternalApiError on API failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'City not found' }),
      });

      await expect(
        weatherService.getWeatherData({ type: 'city', value: 'InvalidCity' })
      ).rejects.toThrow(ExternalApiError);
    });

    it('should throw ExternalApiError on network failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(
        weatherService.getWeatherData({ type: 'city', value: 'London' })
      ).rejects.toThrow(ExternalApiError);
    });
  });
});

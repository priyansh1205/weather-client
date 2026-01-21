import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWeather } from './useWeather';
import * as apiEndpoints from '@/lib/api/endpoints';
import React from 'react';

jest.mock('@/lib/api/endpoints');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };

  return Wrapper;
};

describe('useWeather', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch weather data successfully', async () => {
    const mockData = {
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

    (apiEndpoints.fetchWeatherData as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useWeather({ type: 'city', value: 'London' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('should use correct query key for city search', async () => {
    const mockData = {
      name: 'Paris',
      main: { temp: 15, humidity: 60, feels_like: 14, temp_min: 13, temp_max: 17 },
      weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }],
      sys: { country: 'FR' },
    };

    (apiEndpoints.fetchWeatherData as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useWeather({ type: 'city', value: 'Paris' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiEndpoints.fetchWeatherData).toHaveBeenCalledWith({
      type: 'city',
      value: 'Paris',
    });
  });
});

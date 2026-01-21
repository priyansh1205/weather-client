import { renderHook, waitFor } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';

describe('useGeolocation', () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
  };

  beforeAll(() => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return coordinates on success', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success({
        coords: {
          latitude: 12.9716,
          longitude: 77.5946,
        },
      })
    );

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.coordinates).toEqual({
      lat: 12.9716,
      lon: 77.5946,
    });
  });

  it('should handle geolocation errors', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((_, error) =>
      error({
        code: 1,
        message: 'User denied Geolocation',
      })
    );

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

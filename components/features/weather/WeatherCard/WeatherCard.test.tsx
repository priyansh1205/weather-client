import { render, screen } from '@testing-library/react';
import { WeatherCard } from './WeatherCard';
import { WeatherData } from '@/types';

const mockWeatherData: WeatherData = {
  name: 'Budaun',
  coord: { lon: 79.1167, lat: 28.05 },
  sys: { country: 'IN', sunrise: 1768959307, sunset: 1768997638 },
  main: {
    temp: 23.52,
    feels_like: 22.66,
    temp_min: 20.0,
    temp_max: 25.0,
    pressure: 1015,
    humidity: 28,
    sea_level: 1015,
    grnd_level: 995,
  },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  ],
  wind: {
    speed: 4.91,
    deg: 292,
    gust: 5.77,
  },
  clouds: {
    all: 0,
  },
  visibility: 10000,
  dt: 1768989757,
  timezone: 19800,
};

describe('WeatherCard', () => {
  it('renders weather data correctly', () => {
    render(<WeatherCard data={mockWeatherData} />);

    // City and country
    expect(screen.getByText('Budaun, IN')).toBeInTheDocument();
    
    // Main temperature (the large one)
    const mainTemp = screen.getByText('24°');
    expect(mainTemp).toHaveClass('text-7xl');
    
    // Description
    expect(screen.getByText('clear sky')).toBeInTheDocument();
    
    // Humidity
    expect(screen.getByText('28%')).toBeInTheDocument();
    
    // Wind speed
    expect(screen.getByText('4.91 m/s')).toBeInTheDocument();
  });

  it('renders temperature details', () => {
    render(<WeatherCard data={mockWeatherData} />);

    // Feels like temperature
    expect(screen.getByText('Feels like')).toBeInTheDocument();
    expect(screen.getByText('23°')).toBeInTheDocument();
    
    // Min and max temperatures
    expect(screen.getByText('20°')).toBeInTheDocument(); // Min
    expect(screen.getByText('25°')).toBeInTheDocument(); // Max
  });

  it('renders additional weather details', () => {
    render(<WeatherCard data={mockWeatherData} />);

    // Pressure
    expect(screen.getByText('1015 hPa')).toBeInTheDocument();
    
    // Visibility
    expect(screen.getByText('10.0 km')).toBeInTheDocument();
    
    // Clouds
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    // Wind direction label
    expect(screen.getByText(/Direction/i)).toBeInTheDocument();
  });

  it('renders sunrise and sunset times', () => {
    render(<WeatherCard data={mockWeatherData} />);

    // Check for sunrise and sunset labels
    expect(screen.getByText('Sunrise')).toBeInTheDocument();
    expect(screen.getByText('Sunset')).toBeInTheDocument();
    
    // The times will be formatted, just check they exist
    const times = screen.getAllByText(/\d{1,2}:\d{2}/);
    expect(times.length).toBeGreaterThanOrEqual(2);
  });

  it('renders weather icon', () => {
    render(<WeatherCard data={mockWeatherData} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('01d'));
    expect(image).toHaveAttribute('alt', 'clear sky');
  });

  it('displays wind gust when available', () => {
    render(<WeatherCard data={mockWeatherData} />);
    
    expect(screen.getByText(/Wind gusts up to 5.77 m\/s/i)).toBeInTheDocument();
  });

  it('does not display wind gust when unavailable', () => {
    const dataWithoutGust = {
      ...mockWeatherData,
      wind: {
        speed: 4.91,
        deg: 292,
      },
    };
    
    render(<WeatherCard data={dataWithoutGust} />);
    
    expect(screen.queryByText(/Wind gusts/i)).not.toBeInTheDocument();
  });

  it('renders all weather metric sections', () => {
    render(<WeatherCard data={mockWeatherData} />);

    // Check all metric labels are present
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('Wind Speed')).toBeInTheDocument();
    expect(screen.getByText('Direction')).toBeInTheDocument();
    expect(screen.getByText('Pressure')).toBeInTheDocument();
    expect(screen.getByText('Visibility')).toBeInTheDocument();
    expect(screen.getByText('Clouds')).toBeInTheDocument();
  });

  it('displays correct wind direction', () => {
    render(<WeatherCard data={mockWeatherData} />);

    // 292° should be W (West) - more specific check
    expect(screen.getByText('W (292°)')).toBeInTheDocument();
  });

  it('formats visibility correctly', () => {
    render(<WeatherCard data={mockWeatherData} />);

    // 10000m = 10.0km
    expect(screen.getByText('10.0 km')).toBeInTheDocument();
  });

  it('calculates different wind directions correctly', () => {
    // Test North
    const northWind = { ...mockWeatherData, wind: { speed: 5, deg: 0 } };
    const { rerender } = render(<WeatherCard data={northWind} />);
    expect(screen.getByText('N (0°)')).toBeInTheDocument();

    // Test East
    const eastWind = { ...mockWeatherData, wind: { speed: 5, deg: 90 } };
    rerender(<WeatherCard data={eastWind} />);
    expect(screen.getByText('E (90°)')).toBeInTheDocument();

    // Test South
    const southWind = { ...mockWeatherData, wind: { speed: 5, deg: 180 } };
    rerender(<WeatherCard data={southWind} />);
    expect(screen.getByText('S (180°)')).toBeInTheDocument();
  });
});

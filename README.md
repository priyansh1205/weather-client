# 🌦️ Weather Client Application

## Features

- **Location-Based Weather**: Automatically detects your location using browser geolocation
- **City Search**: Search for any city worldwide with real-time suggestions
- **Weather Info**: 
  - Current temperature with feels-like temperature
  - Min/Max temperatures
  - Humidity and atmospheric pressure
  - Wind speed, direction, and gusts
  - Visibility and cloud coverage
  - Sunrise and sunset times
- **Fast & Responsive**: Built with Next.js 16 App Router for optimal performance
- **Modern UI**: Sleek design using Shadcn/UI components with Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Testing
- **Test Framework**: [Jest](https://jestjs.io/)
- **Testing Library**: [React Testing Library](https://testing-library.com/react)
- **Coverage**: Unit tests for hooks, components, and services

### API
- **Weather Data**: [OpenWeatherMap API](https://openweathermap.org/api)
- **Geocoding**: OpenWeatherMap Geocoding API

### Development Tools
- **Package Manager**: pnpm
- **Linting**: Biome

## Project Structure

```
weather-client/
├── __tests__/             # Test setup and utilities
├── app/                    
│   ├── (weather)/         # Weather route group
│   │   ├── page.tsx       
│   │   ├── layout.tsx     
│   │   ├── loading.tsx    
│   │   └── error.tsx      
│   ├── api/               # API routes
│   │   ├── weather/       
│   │   └── geo/           
│   ├── layout.tsx        
│   ├── global-error.tsx   
│   └── not-found.tsx      
├── components/            # React components
│   ├── features/
│   │   └── weather/
│   │       ├── WeatherCard/      
│   │       └── WeatherSearch/    
│   ├── ui/                # Shadcn UI components
│   └── ErrorFallback/     # Error boundary component
├── hooks/                 # Custom React hooks
│   ├── useWeather/         
│   ├── useGeolocation/    
│   ├── useDebounce/       
│   └── useCitySuggestions/ # City autocomplete
├── lib/                   # Utility libraries
│   ├── api/               
│   ├── errors/            
│   ├── logger/            
│   ├── constants.ts       
│   └── utils.ts           
├── services/              # Business logic
│   └── weather/           # Weather service
└── types/                 # TypeScript type definitions
    ├── weather.ts
    └── api.ts
```

## Prerequisites

- **Node.js**: >= 18.0.0
- **Package Manager**: pnpm 
- **OpenWeatherMap API Key**: [Get API key](https://openweathermap.org/api)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/priyansh1205/weather-client.git
   cd weather-client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # OpenWeatherMap API Key (Required)
   OPENWEATHERMAP_API_KEY=your_api_key_here

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   To get your API key:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Navigate to API Keys section
   - Copy your API key

4. **Run the development server**
   ```bash
   pnpm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode
```bash
pnpm test:watch
```

### Generate coverage report
```bash
pnpm test:coverage
```

### Test Structure
- **Unit Tests**: Individual components, hooks, and utilities
- **Integration Tests**: API routes and services

## API Routes

### Weather Endpoint
```
GET /api/weather?city=London
GET /api/weather?lat=12.9716&lon=77.5946
```

**Response:**
```json
{
  "name": "London",
  "main": {
    "temp": 20,
    "feels_like": 19,
    "temp_min": 18,
    "temp_max": 22,
    "pressure": 1015,
    "humidity": 65
  },
  "weather": [{
    "main": "Clear",
    "description": "clear sky",
    "icon": "01d"
  }],
  "wind": {
    "speed": 4.91,
    "deg": 292,
    "gust": 5.77
  },
  "sys": {
    "country": "GB",
    "sunrise": 1768959307,
    "sunset": 1768997638
  }
}
```

### Geocoding Endpoint
```
GET /api/geo?q=London
```

**Response:**
```json
[
  {
    "name": "London",
    "state": "England",
    "country": "GB",
    "lat": 51.5074,
    "lon": -0.1278
  }
]
```

## Architecture

### Key Design Patterns

1. **Separation of Concerns**
   - Components handle UI only
   - Hooks manage state and side effects
   - Services contain business logic
   - API routes handle external requests

2. **Error Handling**
   - Custom error classes (`AppError`, `ValidationError`, `ExternalApiError`)
   - Global error boundaries
   - API error responses with proper status codes

3. **Data Fetching**
   - React Query for server state management
   - Automatic caching and refetching
   - Optimistic updates

4. **Type Safety**
   - Full TypeScript coverage
   - Strict type checking
   - Type-safe API responses

### Custom Hooks

- **`useWeather`**: Fetches and caches weather data
- **`useGeolocation`**: Handles browser geolocation
- **`useDebounce`**: Debounces user input for search
- **`useCitySuggestions`**: Provides city autocomplete

### State Management

- **React Query**: Server state (weather data, city suggestions)

## UI Components

Built with **Shadcn/UI** for consistency and accessibility:
- `Button`: Interactive buttons with variants
- `Input`: Text input fields
- `Card`: Container for weather information
- Custom weather components

## Build & Deployment

### Production Build
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

### Deploy to Vercel (Recommended)
```bash
vercel deploy
```

### Environment Variables for Production
Make sure to set the following in your deployment platform:
- `OPENWEATHERMAP_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your production domain)

## Security

- API keys are stored in environment variables
- Server-side API routes prevent exposing keys to client
- Input validation on all user inputs

## Performance Optimizations

- React Query caching (5-minute stale time for weather data)
- Debounced search input (500ms delay)
- Next.js automatic code splitting
- Optimized images and assets
- Server-side rendering where appropriate

import '@testing-library/jest-dom';

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, ...rest } = props;
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...rest} />;
  },
}));

// Mock Next.js server
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data,
    })),
  },
  NextRequest: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.OPENWEATHERMAP_API_KEY = 'test-api-key';

// Filter out expected errors and warnings
beforeAll(() => {
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    const fullMessage = args.join(' ');
    
    // Ignore expected test errors
    if (
      message.includes('Not implemented: HTMLFormElement.prototype.requestSubmit') ||
      message.includes('Received `true` for a non-boolean attribute') ||
      fullMessage.includes('Weather service error') || // Expected in tests
      fullMessage.includes('Cannot read properties of undefined')
    ) {
      return;
    }
    originalError(...args);
  };

  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (message.includes('[WARN]')) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

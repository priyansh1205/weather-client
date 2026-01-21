type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, ...args: unknown[]) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'error':
        console.error(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(prefix, message, ...args);
        }
        break;
      default:
        console.log(prefix, message, ...args);
    }

    // In production, you would send this to a service like Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      // Example: Sentry.captureException(args[0]);
    }
  }

  info(message: string, ...args: unknown[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]) {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: unknown[]) {
    this.log('debug', message, ...args);
  }
}

export const logger = new Logger();

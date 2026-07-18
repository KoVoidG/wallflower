export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogPayload {
  message: string;
  level: LogLevel;
  timestamp: string;
  [key: string]: unknown;
}

function sanitize(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'accessToken',
    'refreshToken',
    'idToken',
    'clientSecret',
  ];
  const sanitized = { ...data };
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitize(sanitized[key] as Record<string, unknown>);
    }
  }
  return sanitized;
}

export const logger = {
  log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const cleanMeta = meta ? sanitize(meta) : {};

    if (process.env.NODE_ENV === 'production') {
      const payload: LogPayload = {
        message,
        level,
        timestamp,
        ...cleanMeta,
      };
      console.log(JSON.stringify(payload));
    } else {
      const color =
        level === 'error'
          ? '\x1b[31m'
          : level === 'warn'
            ? '\x1b[33m'
            : level === 'debug'
              ? '\x1b[36m'
              : '\x1b[32m';
      const reset = '\x1b[0m';
      console.log(
        `[${timestamp}] ${color}${level.toUpperCase()}${reset}: ${message}`,
        Object.keys(cleanMeta).length > 0 ? cleanMeta : '',
      );
    }
  },
  info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
  },
  warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
  },
  error(message: string, meta?: Record<string, unknown>) {
    this.log('error', message, meta);
  },
  debug(message: string, meta?: Record<string, unknown>) {
    this.log('debug', message, meta);
  },
};

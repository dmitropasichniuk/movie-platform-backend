import { applyDecorators } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ApiResponse } from "@nestjs/swagger";

interface ThrottleOptions {
  limit: number;
  ttl: number;
  description?: string;
}

// Parent decorator
export function ApiThrottle(options: ThrottleOptions) {
  const { limit, ttl, description } = options;
  const ttlInSeconds = Math.floor(ttl / 1000);

  const defaultDescription =
    description ||
    `Rate limited to ${limit} requests per ${ttlInSeconds} seconds`;

  return applyDecorators(
    Throttle({ default: { limit, ttl } }),
    ApiResponse({
      status: 429,
      description: `Too Many Requests. ${defaultDescription}. Please try again later.`,
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: 429 },
          message: {
            type: "string",
            example: "ThrottlerException: Too Many Requests",
          },
          error: { type: "string", example: "Too Many Requests" },
        },
      },
    }),
  );
}

// Special decorators
export function ApiAuthThrottle(limit = 5, ttlMinutes = 1) {
  return ApiThrottle({
    limit,
    ttl: ttlMinutes * 60 * 1000,
    description: `Authentication rate limited to ${limit} attempts per ${ttlMinutes} minute(s)`,
  });
}

export function ApiPasswordResetThrottle(limit = 5, ttlMinutes = 1) {
  return ApiThrottle({
    limit,
    ttl: ttlMinutes * 60 * 1000,
    description: `Password reset rate limited to ${limit} attempts per ${ttlMinutes} minute(s)`,
  });
}

export function ApiSearchThrottle(limit = 100, ttlMinutes = 1) {
  return ApiThrottle({
    limit,
    ttl: ttlMinutes * 60 * 1000,
    description: `Search rate limited to ${limit} requests per ${ttlMinutes} minute(s)`,
  });
}

// TODO: Decorator for file uploads
export function ApiFileUploadThrottle(limit = 5, ttlMinutes = 1) {
  return ApiThrottle({
    limit,
    ttl: ttlMinutes * 60 * 1000,
    description: `File upload rate limited to ${limit} requests per ${ttlMinutes} minute(s)`,
  });
}

// TODO: Decorator for creating resources. Will be used for reviews, comments, etc.
export function ApiCreateResourceThrottle(limit = 10, ttlMinutes = 1) {
  return ApiThrottle({
    limit,
    ttl: ttlMinutes * 60 * 1000,
    description: `Resource creation rate limited to ${limit} requests per ${ttlMinutes} minute(s)`,
  });
}

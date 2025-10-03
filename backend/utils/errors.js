/**
 * Custom error classes for better error handling and HTTP status mapping
 * @module utils/errors
 */

/**
 * Base application error class
 * @class AppError
 * @extends Error
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when a resource is not found (404)
 * @class NotFoundError
 * @extends AppError
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Error thrown when validation fails (400)
 * @class ValidationError
 * @extends AppError
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

/**
 * Error thrown when a resource already exists (409)
 * @class ConflictError
 * @extends AppError
 */
class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

/**
 * Error thrown for unauthorized access (401)
 * @class UnauthorizedError
 * @extends AppError
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
};

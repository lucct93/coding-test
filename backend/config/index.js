/**
 * Application configuration
 * Centralized configuration management for all environment variables and constants
 * @module config
 */

module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 3002,
    env: process.env.NODE_ENV || 'development',
  },

  // Database configuration
  database: {
    user: process.env.PG_USER || 'app_user',
    password: process.env.PG_PASSWORD || 'coding_test_password',
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    database: process.env.PG_DATABASE || 'datatys_db',
    url: process.env.DATABASE_URL,
  },

  // File upload configuration
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ],
    uploadDir: 'uploads/profile-pictures/',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3002',
  },

  // Security configuration
  security: {
    secret: process.env.SECRET || 'test-dev-secret',
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: 100, // max 100 requests per window
  },

  // API configuration
  api: {
    prefix: '/api',
    version: '/v1',
  },
};

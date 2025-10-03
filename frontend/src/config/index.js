/**
 * Frontend application configuration
 * Centralized configuration for API endpoints and environment settings
 * @module config
 */

/**
 * Get API base URL from environment variable or default
 * @type {string}
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

/**
 * Application configuration object
 */
const config = {
  api: {
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds
  },
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  },
  localStorage: {
    keys: {
      userId: 'userId',
      token: 'token',
    },
  },
};

export default config;

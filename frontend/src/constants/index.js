export const USER_MODE = {
  CREATE: 'create',
  DETAIL: 'detail',
  EDIT: 'edit',
};

export const STORAGE_KEYS = {
  USER_ID: 'userId',
};

export const API_ENDPOINTS = {
  USERS: '/api/users',
  HEALTH: '/health',
};

export const COLORS = {
  PRIMARY: '#153376',
  SECONDARY: '#4D4F5C',
  ERROR: '#e74c3c',
  SUCCESS: '#27ae60',
};

export const VALIDATION = {
  EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  NAME_PATTERN: /^[A-Za-z\s'-]+$/,
  PHONE_PATTERN: /^[\d\s()+-]+$/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MAX_EMAIL_LENGTH: 100,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 20,
  IMAGE_MAX_SIZE: 5 * 1024 * 1024,
  IMAGE_ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
};

export const MESSAGES = {
  SUCCESS: {
    PROFILE_CREATED: 'Profile created successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    PROFILE_DELETED: 'Profile deleted successfully!',
  },
  ERROR: {
    FETCH_USER: 'Failed to fetch user',
    SAVE_PROFILE: 'Failed to save profile',
    DELETE_PROFILE: 'Failed to delete profile',
    IMAGE_TOO_LARGE: 'Image size must be less than 5MB',
    IMAGE_INVALID_TYPE: 'Only JPEG, PNG, GIF, and WebP images are allowed',
  },
  CONFIRM: {
    DELETE_PROFILE: 'Are you sure you want to delete this profile?',
  },
};

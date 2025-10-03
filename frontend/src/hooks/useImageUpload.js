/**
 * Custom hook for handling image uploads with validation
 * Provides image preview, validation, and error handling
 * @module hooks/useImageUpload
 */

import { useState, useEffect } from 'react';
import { VALIDATION, MESSAGES } from '../constants';

/**
 * Hook to manage image upload functionality
 * @param {string} initialImage - Initial image URL
 * @returns {Object} Image upload state and handlers
 * @property {string} imagePreview - Data URL or server URL for preview
 * @property {File|null} imageFile - Selected file object
 * @property {string} imageError - Error message if validation fails
 * @property {Function} handleImageChange - Handler for file input change
 * @property {Function} clearImage - Clear selected image
 */
export const useImageUpload = (initialImage = '') => {
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');

  // Set initial image preview if provided
  useEffect(() => {
    if (initialImage) {
      setImagePreview(initialImage);
    }
  }, [initialImage]);

  /**
   * Validate file type
   * @param {File} file - File to validate
   * @returns {boolean} True if valid
   */
  const validateFileType = (file) => {
    if (!VALIDATION.IMAGE_ALLOWED_TYPES.includes(file.type)) {
      setImageError(MESSAGES.ERROR.IMAGE_INVALID_TYPE);
      return false;
    }
    return true;
  };

  /**
   * Validate file size
   * @param {File} file - File to validate
   * @returns {boolean} True if valid
   */
  const validateFileSize = (file) => {
    if (file.size > VALIDATION.IMAGE_MAX_SIZE) {
      setImageError(MESSAGES.ERROR.IMAGE_TOO_LARGE);
      return false;
    }
    return true;
  };

  /**
   * Handle image file selection
   * @param {Event} e - File input change event
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous errors
    setImageError('');

    // Validate file
    if (!validateFileType(file) || !validateFileSize(file)) {
      e.target.value = '';
      return;
    }

    // Set file for upload
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.onerror = () => {
      setImageError('Failed to read image file');
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  /**
   * Clear selected image and reset state
   */
  const clearImage = () => {
    setImagePreview('');
    setImageFile(null);
    setImageError('');
  };

  return {
    imagePreview,
    imageFile,
    imageError,
    handleImageChange,
    clearImage,
  };
};

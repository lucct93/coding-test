import { useState, useEffect, useCallback } from 'react';
import api from '../tools/api';
import { API_ENDPOINTS, STORAGE_KEYS, MESSAGES } from '../constants';

export const useUser = (userId = null) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch user by ID
   */
  const fetchUser = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
      setUser(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || MESSAGES.ERROR.FETCH_USER;
      setError(errorMessage);
      setUser(null);

      if (err.response?.status === 404) {
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new user
   */
  const createUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await api.post(API_ENDPOINTS.USERS, userData, config);
      setUser(response.data);
      localStorage.setItem(STORAGE_KEYS.USER_ID, response.data.id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || MESSAGES.ERROR.SAVE_PROFILE;
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update existing user
   */
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      setError(null);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, userData, config);
      setUser(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || MESSAGES.ERROR.SAVE_PROFILE;
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete user
   */
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      setUser(null);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.error || MESSAGES.ERROR.DELETE_PROFILE;
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  return {
    user,
    loading,
    error,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    clearError,
  };
};

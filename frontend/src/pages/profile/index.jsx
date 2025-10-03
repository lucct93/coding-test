import React, { useState, useEffect } from 'react';
import ProfileForm from '../../componenets/Profile/ProfileForm';
import ProfileDetail from '../../componenets/Profile/ProfileDetail';
import ConfirmModal from '../../componenets/common/ConfirmModal';
import Toast from '../../componenets/common/Toast';
import api from '../../tools/api';
import {
  USER_MODE, STORAGE_KEYS, API_ENDPOINTS, MESSAGES,
} from '../../constants';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(USER_MODE.CREATE);
  const [userId, setUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchUser = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_ENDPOINTS.USERS}/${userId}`);
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || MESSAGES.ERROR.FETCH_USER);
      setUser(null);
      if (err.response?.status === 404) {
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
        setUserId(null);
        setMode(USER_MODE.CREATE);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (storedUserId) {
      setUserId(storedUserId);
      setMode(USER_MODE.DETAIL);
    }
  }, []);

  useEffect(() => {
    if (userId && (mode === USER_MODE.DETAIL || mode === USER_MODE.EDIT)) {
      fetchUser();
    }
  }, [mode, userId, fetchUser]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      if (mode === USER_MODE.CREATE) {
        const response = await api.post(API_ENDPOINTS.USERS, data, config);
        setUser(response.data);
        setUserId(response.data.id);
        localStorage.setItem(STORAGE_KEYS.USER_ID, response.data.id);
        setMode(USER_MODE.DETAIL);
        setToast({ message: MESSAGES.SUCCESS.PROFILE_CREATED, type: 'success' });
      } else if (mode === USER_MODE.EDIT) {
        const response = await api.put(`${API_ENDPOINTS.USERS}/${userId}`, data, config);
        setUser(response.data);
        setMode(USER_MODE.DETAIL);
        setToast({ message: MESSAGES.SUCCESS.PROFILE_UPDATED, type: 'success' });
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || MESSAGES.ERROR.SAVE_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setMode(USER_MODE.EDIT);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    try {
      setLoading(true);
      await api.delete(`${API_ENDPOINTS.USERS}/${userId}`);
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      setUser(null);
      setMode(USER_MODE.CREATE);
      setUserId(null);
      setToast({ message: MESSAGES.SUCCESS.PROFILE_DELETED, type: 'success' });
    } catch (err) {
      setError(err.response?.data?.error || MESSAGES.ERROR.DELETE_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      {error && <div className="error-container">{error}</div>}

      {mode === USER_MODE.DETAIL && user && (
        <ProfileDetail
          user={user}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {(mode === USER_MODE.CREATE || mode === USER_MODE.EDIT) && (
        <ProfileForm
          user={user}
          onSubmit={handleSubmit}
          onDelete={mode === USER_MODE.EDIT ? handleDeleteClick : null}
          mode={mode}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Profile"
        message={MESSAGES.CONFIRM.DELETE_PROFILE}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

export default ProfilePage;

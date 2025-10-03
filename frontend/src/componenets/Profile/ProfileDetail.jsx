import React from 'react';
import PropTypes from 'prop-types';
import './ProfileDetail.css';

function ProfileDetail({ user, onEdit, onDelete }) {
  return (
    <div className="profile-detail-container">
      <img src="/SOCOTEC-LOGO.png" alt="SOCOTEC" className="company-logo" />
      <h1 className="profile-title">User Profile</h1>

      {user.profile_picture && (
        <div className="profile-picture-display">
          <img src={`http://localhost:3002${user.profile_picture}`} alt="Profile" className="profile-picture" />
        </div>
      )}

      <div className="detail-content">
        <div className="detail-row">
          <div className="detail-field">
            <span className="detail-label">First Name</span>
            <span className="detail-value">{user.first_name || '—'}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Last Name</span>
            <span className="detail-value">{user.last_name || '—'}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-field">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email || '—'}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Phone Number</span>
            <span className="detail-value">{user.phone_number || '—'}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-field">
            <span className="detail-label">Country</span>
            <span className="detail-value">{user.country || '—'}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">City</span>
            <span className="detail-value">{user.city || '—'}</span>
          </div>
        </div>
      </div>

      <div className="detail-actions">
        <button type="button" onClick={onEdit} className="btn-primary">
          Edit Profile
        </button>
        <button type="button" onClick={onDelete} className="btn-danger">
          Delete Profile
        </button>
      </div>
    </div>
  );
}

ProfileDetail.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    country: PropTypes.string,
    city: PropTypes.string,
    phone_number: PropTypes.string,
    profile_picture: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProfileDetail;

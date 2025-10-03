import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form'; // eslint-disable-line import/no-extraneous-dependencies
import Select from 'react-select'; // eslint-disable-line import/no-extraneous-dependencies
import { countries, cities } from '../../data/locations';
import { USER_MODE, VALIDATION, MESSAGES } from '../../constants';
import './ProfileForm.css';

function ProfileForm({
  user, onSubmit, onDelete, mode,
}) {
  const [imageError, setImageError] = useState('');
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: user || {
      first_name: '',
      last_name: '',
      email: '',
      country: '',
      city: '',
      phone_number: '',
      profile_picture: '',
    },
  });

  const [availableCities, setAvailableCities] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const selectedCountry = watch('country');

  useEffect(() => {
    if (user && user.profile_picture) {
      setImagePreview(`http://localhost:3002${user.profile_picture}`);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageError('');

    if (!VALIDATION.IMAGE_ALLOWED_TYPES.includes(file.type)) {
      setImageError(MESSAGES.ERROR.IMAGE_INVALID_TYPE);
      e.target.value = '';
      return;
    }

    if (file.size > VALIDATION.IMAGE_MAX_SIZE) {
      setImageError(MESSAGES.ERROR.IMAGE_TOO_LARGE);
      e.target.value = '';
      return;
    }

    setImageFile(file);
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

  useEffect(() => {
    if (selectedCountry) {
      setAvailableCities(cities[selectedCountry] || []);
      if (user?.country !== selectedCountry) setValue('city', '');
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, setValue, user]);

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('country', data.country || '');
    formData.append('city', data.city || '');
    formData.append('phone_number', data.phone_number || '');

    if (imageFile) {
      formData.append('profile_picture', imageFile);
    } else if (user?.profile_picture) {
      formData.append('profile_picture', user.profile_picture);
    }

    onSubmit(formData);
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#153376' : '#ddd',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#153376',
      },
      padding: '4px',
      fontSize: '16px',
      fontFamily: 'Source Sans Pro, sans-serif',
    }),
    option: (base, state) => {
      let backgroundColor = 'white';
      if (state.isSelected) {
        backgroundColor = '#153376';
      } else if (state.isFocused) {
        backgroundColor = '#f0f0f0';
      }

      return {
        ...base,
        backgroundColor,
        color: state.isSelected ? 'white' : '#4D4F5C',
        fontFamily: 'Source Sans Pro, sans-serif',
      };
    },
  };

  return (
    <div className="profile-form-container">
      <img src="/SOCOTEC-LOGO.png" alt="SOCOTEC" className="company-logo" />
      <h1 className="profile-title">
        {mode === USER_MODE.CREATE ? 'Create Profile' : 'Edit Profile'}
      </h1>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="profile-form">
        <div className="profile-picture-section">
          <div className="image-preview-container">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="profile-image-preview" />
            ) : (
              <div className="profile-image-placeholder">No Image</div>
            )}
          </div>
          <div className="image-upload-controls">
            <label htmlFor="profile_picture" className="btn-upload">
              Choose Picture
              <input
                id="profile_picture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview('');
                  setValue('profile_picture', '');
                  setImageError('');
                }}
                className="btn-remove-image"
              >
                Remove
              </button>
            )}
          </div>
          {imageError && (
            <span className="error-message image-error">{imageError}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="first_name">
            <span>
              First Name
              <span className="required">*</span>
            </span>
            <input
              id="first_name"
              placeholder="Enter your first name"
              {...register('first_name', {
                required: 'First name is required',
                minLength: {
                  value: VALIDATION.MIN_NAME_LENGTH,
                  message: `First name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`,
                },
                maxLength: {
                  value: VALIDATION.MAX_NAME_LENGTH,
                  message: `First name must not exceed ${VALIDATION.MAX_NAME_LENGTH} characters`,
                },
                pattern: {
                  value: VALIDATION.NAME_PATTERN,
                  message: 'First name can only contain letters, spaces, hyphens, and apostrophes',
                },
              })}
              className={errors.first_name ? 'error' : ''}
            />
          </label>
          {errors.first_name && (
            <span className="error-message">{errors.first_name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="last_name">
            <span>
              Last Name
              <span className="required">*</span>
            </span>
            <input
              id="last_name"
              placeholder="Enter your last name"
              {...register('last_name', {
                required: 'Last name is required',
                minLength: {
                  value: VALIDATION.MIN_NAME_LENGTH,
                  message: `Last name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`,
                },
                maxLength: {
                  value: VALIDATION.MAX_NAME_LENGTH,
                  message: `Last name must not exceed ${VALIDATION.MAX_NAME_LENGTH} characters`,
                },
                pattern: {
                  value: VALIDATION.NAME_PATTERN,
                  message: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
                },
              })}
              className={errors.last_name ? 'error' : ''}
            />
          </label>
          {errors.last_name && (
            <span className="error-message">{errors.last_name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <span>
              Email
              <span className="required">*</span>
            </span>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: VALIDATION.EMAIL_PATTERN,
                  message: 'Please enter a valid email address',
                },
                maxLength: {
                  value: VALIDATION.MAX_EMAIL_LENGTH,
                  message: `Email must not exceed ${VALIDATION.MAX_EMAIL_LENGTH} characters`,
                },
              })}
              className={errors.email ? 'error' : ''}
            />
          </label>
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">
            <span>Phone Number</span>
            <input
              id="phone_number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register('phone_number', {
                pattern: {
                  value: VALIDATION.PHONE_PATTERN,
                  message: 'Please enter a valid phone number',
                },
                minLength: {
                  value: VALIDATION.MIN_PHONE_LENGTH,
                  message: `Phone number must be at least ${VALIDATION.MIN_PHONE_LENGTH} characters`,
                },
                maxLength: {
                  value: VALIDATION.MAX_PHONE_LENGTH,
                  message: `Phone number must not exceed ${VALIDATION.MAX_PHONE_LENGTH} characters`,
                },
              })}
              onKeyDown={(e) => {
                if (e.key.length === 1 && !/[\d\s()+-]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className={errors.phone_number ? 'error' : ''}
            />
          </label>
          {errors.phone_number && (
            <span className="error-message">{errors.phone_number.message}</span>
          )}
        </div>

        <div className="form-group">
          <span className="select-label">Country</span>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                inputId="country"
                options={countries}
                value={countries.find((c) => c.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value || '')}
                isClearable
                placeholder="Select a country..."
                styles={customSelectStyles}
              />
            )}
          />
        </div>

        <div className="form-group">
          <span className="select-label">City</span>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                inputId="city"
                options={availableCities}
                value={availableCities.find((c) => c.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value || '')}
                isClearable
                placeholder="Select a city..."
                isDisabled={!selectedCountry}
                styles={customSelectStyles}
              />
            )}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {mode === USER_MODE.CREATE ? 'Create' : 'Save Changes'}
          </button>

          {mode === USER_MODE.EDIT && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="btn-danger"
            >
              Delete Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

ProfileForm.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    country: PropTypes.string,
    city: PropTypes.string,
    phone_number: PropTypes.string,
    profile_picture: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  mode: PropTypes.oneOf(['create', 'edit']),
};

ProfileForm.defaultProps = {
  user: null,
  onDelete: null,
  mode: 'create',
};

export default ProfileForm;

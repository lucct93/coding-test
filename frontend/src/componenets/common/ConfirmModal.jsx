import React from 'react';
import PropTypes from 'prop-types';
import './ConfirmModal.css';

function ConfirmModal({
  isOpen, title, message, onConfirm, onCancel, confirmText, cancelText,
}) {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <button
        type="button"
        className="modal-backdrop"
        onClick={onCancel}
        aria-label="Close modal"
        tabIndex={-1}
      />
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-message"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
        </div>
        <div className="modal-body">
          <p id="modal-message" className="modal-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="modal-btn modal-btn-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="modal-btn modal-btn-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

ConfirmModal.defaultProps = {
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
};

export default ConfirmModal;

const { AppError } = require('../utils/errors');
const config = require('../config');
const { logError } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log all errors to file and console
  logError(err, req);

  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? `File too large. Max size: ${config.upload.maxFileSize / 1024 / 1024}MB`
      : 'File upload error';
    return res.status(400).json({ error: message });
  }

  if (err.code === '23505') return res.status(409).json({ error: 'Resource already exists' });

  return res.status(500).json({ error: 'Internal server error' });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const errorLogPath = path.join(logDir, 'error.log');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logError = (error, req = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message: error.message,
    stack: error.stack,
    ...(req && {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    }),
  };

  const logLine = `${JSON.stringify(logEntry)}\n`;

  fs.appendFile(errorLogPath, logLine, (err) => {
    if (err) console.error('Failed to write to error log:', err);
  });

  // Also log to console
  console.error(`[${timestamp}] Error:`, error.message);
  if (error.stack) console.error(error.stack);
};

module.exports = { logError };

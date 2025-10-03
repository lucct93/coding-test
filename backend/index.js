const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morganMiddleware = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const db = require('./sql/db');
const config = require('./config');

const port = config.server.port;

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api/', limiter);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(morganMiddleware);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

app.get('/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Health check failed:', error.message);
    res.status(503).json({ ok: false, error: 'Database not ready' });
  }
});

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Datatys App running on port ${port} in ${config.server.env} mode`);
});

module.exports = server;

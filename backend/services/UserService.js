const db = require('../sql/db');
const { NotFoundError, ConflictError } = require('../utils/errors');
const FileService = require('./FileService');

class UserService {
  static async getUserById(userId) {
    const queryText = {
      text: `SELECT id, email, first_name, last_name, country, city,
             phone_number, profile_picture, position, created_at, updated_at
             FROM users
             WHERE id = $1`,
      values: [userId],
    };

    const { rows } = await db.query(queryText);

    if (rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    return rows[0];
  }

  static async createUser(userData) {
    const {
      email,
      first_name,
      last_name,
      country,
      city,
      phone_number,
      profile_picture,
    } = userData;

    const queryText = {
      text: `INSERT INTO users (email, first_name, last_name, country, city, phone_number, profile_picture)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, email, first_name, last_name, country, city, phone_number, profile_picture, created_at, updated_at`,
      values: [email, first_name, last_name, country, city, phone_number, profile_picture],
    };

    try {
      const { rows } = await db.query(queryText);
      return rows[0];
    } catch (error) {
      if (error.code === '23505') throw new ConflictError('Email already exists');
      throw error;
    }
  }

  static async updateUser(userId, userData) {
    const {
      email,
      first_name,
      last_name,
      country,
      city,
      phone_number,
      profile_picture,
    } = userData;

    const queryText = {
      text: `UPDATE users
             SET email = $1, first_name = $2, last_name = $3, country = $4,
                 city = $5, phone_number = $6, profile_picture = $7, updated_at = NOW()
             WHERE id = $8
             RETURNING id, email, first_name, last_name, country, city, phone_number, profile_picture, created_at, updated_at`,
      values: [email, first_name, last_name, country, city, phone_number, profile_picture, userId],
    };

    try {
      const { rows } = await db.query(queryText);

      if (rows.length === 0) {
        throw new NotFoundError('User not found');
      }

      return rows[0];
    } catch (error) {
      if (error.code === '23505') throw new ConflictError('Email already exists');
      throw error;
    }
  }

  static async deleteUser(userId) {
    const queryText = {
      text: 'DELETE FROM users WHERE id = $1 RETURNING id, profile_picture',
      values: [userId],
    };

    const { rows } = await db.query(queryText);

    if (rows.length === 0) throw new NotFoundError('User not found');

    // Clean up profile picture
    if (rows[0].profile_picture) {
      await FileService.deleteFile(rows[0].profile_picture);
    }

    return rows[0];
  }

  static async getUserProfilePicture(userId) {
    const queryText = {
      text: 'SELECT profile_picture FROM users WHERE id = $1',
      values: [userId],
    };

    const { rows } = await db.query(queryText);

    if (rows.length === 0) {
      return null;
    }

    return rows[0].profile_picture;
  }
}

module.exports = UserService;

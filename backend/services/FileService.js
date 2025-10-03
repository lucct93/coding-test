const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

class FileService {
  static async deleteFile(filePath) {
    if (!filePath) return false;

    const fullPath = path.join(__dirname, '..', filePath);

    try {
      await fs.unlink(fullPath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') return true; // Already deleted
      return false;
    }
  }

  static async deleteProfilePicture(filename) {
    if (!filename) return false;

    const filePath = path.join(__dirname, '..', config.upload.uploadDir, filename);

    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = FileService;

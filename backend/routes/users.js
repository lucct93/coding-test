const express = require('express');
const upload = require('../middlewares/upload');
const UserService = require('../services/UserService');
const FileService = require('../services/FileService');
const { asyncHandler } = require('../middlewares/errorHandler');

const router = express.Router();

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);
  res.json(user);
}));

router.post('/', upload.single('profile_picture'), asyncHandler(async (req, res) => {
  const { email, first_name, last_name, country, city, phone_number } = req.body;
  const profilePicturePath = req.file ? `/uploads/profile-pictures/${req.file.filename}` : null;

  try {
    const user = await UserService.createUser({
      email, first_name, last_name, country, city, phone_number,
      profile_picture: profilePicturePath,
    });
    res.status(201).json(user);
  } catch (error) {
    // Clean up uploaded file if creation fails
    if (req.file) await FileService.deleteProfilePicture(req.file.filename);
    throw error;
  }
}));

router.put('/:id', upload.single('profile_picture'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email, first_name, last_name, country, city, phone_number } = req.body;
  let profilePicturePath = req.body.profile_picture;

  if (req.file) {
    profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
  }

  try {
    const oldProfilePicture = await UserService.getUserProfilePicture(id);
    const user = await UserService.updateUser(id, {
      email, first_name, last_name, country, city, phone_number,
      profile_picture: profilePicturePath,
    });

    // Delete old profile picture
    if (req.file && oldProfilePicture) {
      await FileService.deleteFile(oldProfilePicture);
    }

    res.json(user);
  } catch (error) {
    if (req.file) await FileService.deleteProfilePicture(req.file.filename);
    throw error;
  }
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await UserService.deleteUser(req.params.id);
  res.json({ message: 'User deleted successfully' });
}));

module.exports = router;

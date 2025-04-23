const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { auth, isAdmin } = require('../middlewares/auth');

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes - require authentication
router.get('/', auth, isAdmin, UserController.getAllUsers);
router.get('/:id', auth, UserController.getUserById);
router.put('/:id', auth, UserController.updateUser);
router.delete('/:id', auth, isAdmin, UserController.deleteUser);

module.exports = router; 
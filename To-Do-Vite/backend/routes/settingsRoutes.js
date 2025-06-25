const express = require('express');
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', settingsController.getUserSettings);

router.put('/', settingsController.updateUserSettings);

module.exports = router; 
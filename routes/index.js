// Inside the folder routes, create a file index.js that contains all endpoints of our API:

// GET /status => AppController.getStatus
// GET /stats => AppController.getStats
const express = require('express');

const router = express.Router();
const { getStatus, getStats } = require('../controllers/AppController');

router.get('/status', getStatus);
router.get('/stats', getStats);

module.exports = router;

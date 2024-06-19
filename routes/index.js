// Inside the folder routes, create a file index.js that contains all endpoints of our API:

// GET /status => AppController.getStatus
// GET /stats => AppController.getStats
// POST /users => UsersController.postNew
const express = require('express');

const router = express.Router();
const { getStatus, getStats } = require('../controllers/AppController');
const { postNew } = require('../controllers/UsersController')

router.get('/status', getStatus);
router.get('/stats', getStats);
router.post('/users', postNew)
module.exports = router;

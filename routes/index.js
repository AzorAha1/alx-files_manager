// Inside the folder routes, create a file index.js that contains all endpoints of our API:

// GET /status => AppController.getStatus
// GET /stats => AppController.getStats
// POST /users => UsersController.postNew
const express = require('express');

const router = express.Router();
const { getStatus, getStats } = require('../controllers/AppController');
const { postNew, getMe } = require('../controllers/UsersController');
const { getConnect, getDisconnect } = require('../controllers/AuthController')

router.get('/status', getStatus);
router.get('/stats', getStats);
router.post('/users', postNew);
router.get('/connect', getConnect);
router.get('/disconnect', getDisconnect);
router.get('/users/me', getMe);
module.exports = router;

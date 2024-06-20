const redis = require('redis');
const dbClient = require('../utils/db');

const client = redis.createClient();
let isconnected = false;
client.on('connect', () => {
  console.log('redis connected');
  isconnected = true;
  return isconnected;
});

const getStatus = (req, res) => {
  res.status(200).json({
    redis: true,
    db: dbClient.isAlive(),
  });
};

const getStats = async (req, res) => {
  res.status(200).json({
    users: await dbClient.nbUsers(),
    files: await dbClient.nbFiles(),
  });
};

module.exports = { getStatus, getStats };

// Inside the folder controllers, create a file AppController.js that contains the definition of the 2 endpoints:

// GET /status should return if Redis is alive and if the DB is alive too by using the 2 utils created previously: { "redis": true, "db": true } with a status code 200
// GET /stats should return the number of users and files in DB: { "users": 12, "files": 1231 } with a status code 200
// users collection must be used for counting all users
// files collection must be used for counting all files
import dbClient from '../utils/db'; 
const express = require('express');
const redis = require('redis');
const app = express()
const client = redis.createClient()
let isconnected = false
client.on('connect', () => {
    console.log('redis connected')
    isconnected = true
})

const getStatus = (req, res) => {
    res.status(200).json({
        'redis': true,
        'db': dbClient.isAlive()
    })
}

const getStats = async (req, res) => {
    res.status(200).json({
        'users': await dbClient.nbUsers(),
        'files': await dbClient.nbFiles()
    })
}

module.exports = { getStatus, getStats };

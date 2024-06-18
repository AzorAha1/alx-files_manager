const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.connected = false;

        this.client.on('error', (error) => {
            console.error('Redis client error:', error);
            this.connected = false;
        });

        this.client.on('connect', () => {
            console.log('Connected to Redis server');
            this.connected = true;
        });
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
    }

    isAlive() {
        return this.connected;
    }

    async get(key) {
        try {
            const value = await this.getAsync(key);
            return value;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async set(key, value, duration) {
        try {
            await this.setAsync(key, value, 'EX', duration);
        } catch (error) {
            console.error(error);
        }
    }

    async del(key) {
        try {
            await this.delAsync(key);
        } catch (error) {
            console.error(error);
        }
    }
}

const redisClient = new RedisClient();
module.exports = redisClient;

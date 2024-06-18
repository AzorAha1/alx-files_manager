const { MongoClient } = require('mongodb');
class DBClient {
    constructor () {
        this.isconnected = false
        const host = process.env.DB_HOST || 'localhost';
        const port = 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        this.uri = `mongodb://${host}:${port}/${database}`;
        this.client = new MongoClient(this.uri,  { useNewUrlParser: true, useUnifiedTopology: true }) 
        this.client.connect().then((client) => {
            this.db = client.db(database)
            this.isconnected = true
            console.log('Mongodb connected !!')
        }).catch((err) => {
            console.log('Error:',  err)
            this.isconnected = false
        })
    }
    isAlive () {
       return this.isconnected
    }
    async nbUsers() {
        if (!this.isAlive() || !this.db) {
            throw new Error('Database not connected');
        }
        try {
            const users = await this.db.collection('users')
            const usercount = await users.countDocuments()
            return usercount
        } catch (error) {
            console.log(error)
        }
        
    }
    async nbFiles() {
        if (!this.isAlive() || !this.db) {
            throw new Error('Database not connected');
        }
        try {
            const files = await this.db.collection('files')
            const filecount = await files.countDocuments()
            return filecount
        } catch (error) {
            console.log(error)
        }
        
    }
}
const dbClient = new DBClient()
module.exports = dbClient
// After the class definition, create and export an instance of DBClient called dbClient
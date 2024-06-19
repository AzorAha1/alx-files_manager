const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.isconnected = false;
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    this.uri = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect().then((client) => {
      this.db = client.db(database);
      this.isconnected = true;
      console.log('Mongodb connected !!');
    }).catch((err) => {
      console.log('Error:', err);
      this.isconnected = false;
    });
  }

  isAlive() {
    return this.isconnected;
  }

  //   async nbUsers() {
  //     const users = await this.db.collection('users');
  //     const usercount = await users.countDocuments();
  //     return usercount;
  //   }

  //   async nbFiles() {
  //     const files = await this.db.collection('files');
  //     const filecount = await files.countDocuments();
  //     return filecount;
  //   }
  async nbUsers() {
    if (!this.db) {
      return 0;
    }
    const users = await this.db.collection('users');
    const usercount = await users.countDocuments();
    return usercount;
  }

  async nbFiles() {
    if (!this.db) {
      return 0;
    }
    const files = await this.db.collection('files');
    const filecount = await files.countDocuments();
    return filecount;
  }
}
const dbClient = new DBClient();
module.exports = dbClient;
// After the class definition, create and export an instance of DBClient called dbClient

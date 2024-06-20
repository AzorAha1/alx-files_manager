const sha1 = require('sha1');
const dbclient = require('../utils/db');
const dbClient = require('../utils/db');
const redisclient = require('../utils/redis');

const postNew = async (req, res) => {
  console.log('received post request to /users');
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      error: 'Missing email',
    });
  }
  if (!password) {
    return res.status(400).json({
      error: 'Missing password',
    });
  }
  try {
    const usercollection = dbclient.db.collection('users');
    const user = await usercollection.findOne({ email });

    if (user) {
      return res.status(400).json({
        error: 'Already exist',
      });
    }
    const hashpassword = sha1(password);
    const newUser = {
      email,
      password: hashpassword,
    };
    const result = await usercollection.insertOne(newUser);
    return res.status(201).json({
      id: result.insertedId,
      email: newUser.email,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getMe = async (req, res) => {
   const token = req.headers['x-token']
   const theuserid = await redisclient.get(`auth_${token}`)
   const usercollection = dbClient.db.collection('users')
   const user = await usercollection.findOne({
      _id: theuserid
   })
   if (!user) {
      return res.status(200).json({
         error: 'Unauthorized'
      })
   }
   return res.status(200).json({
      email: user.email,
      id: user.id
   })
}
module.exports = { postNew, getMe };

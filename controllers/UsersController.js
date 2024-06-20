const crypto = require('crypto');
const dbclient = require('../utils/db');

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
    const hashpassword = crypto.createHash('sha1').update(password).digest('hex')
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
module.exports = { postNew };

const dbclient = require('../utils/db')
const bcrypt = require('bcrypt');
const postNew = async (req, res) => {
   const { email, password } = req.body
   if (!email) {
      return res.status(400).json({
         error: 'Missing email',
      })
   }
   if (!password) {
      return res.status(400).json({
         error: 'Missing password',
      })
   }
   try {
      const usercollection = dbclient.db.collection('users')
      const user = await usercollection.findOne({ email })
      
      if (user) {
         return res.status(400).json({
            error: 'Already exist',
         })
      }
      const hashpassword = await bcrypt.hash(password, 10)
      const newUser = {
         email,
         password: hashpassword
      }
      const result = await usercollection.insertOne(newUser);
      res.status(201).json({
         email: newUser.email,
         id: result.insertedId
      })
   } catch (error) {
      res.status(500).json({error: 'Internal Server Error'})
   }
}
module.exports = postNew
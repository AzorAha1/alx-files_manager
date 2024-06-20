const sha1 = require('sha1');
const dbclient = require('../utils/db');
const { v4: uuidv4 } = require('uuid');
const redisclient = require('../utils/redis')

// an example of what an actual request might look like.

// Assume we have an Authorization header in a request that looks like this:

// makefile
// Copy code
// Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
// authHeader will be equal to 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='.
// We split authHeader by the space character (' '), which gives us an array 
// ['Basic', 'dXNlcm5hbWU6cGFzc3dvcmQ='].
// We take the second element of the array (index 1), 
// which is the base64 encoded string 'dXNlcm5hbWU6cGFzc3dvcmQ='.
// We decode this base64 string using Buffer.from(..., 'base64').toString(), 
// which gives us the decoded string 'username:password'
// const getConnect = async (req, res) => {
//     const authheader = req.headers['authorization']
//     const decodeauthheader = Buffer.from(authheader.split(' ')[1], 'base64').toString()
//     const credentials  = decodeauthheader.split(':')
//     const email = credentials[0]
//     const password = credentials[1]
//     //find user associated with email and sha1 password
//     const usercollection = await dbclient.db.collection('users')
//     const userbyemailandpass = await usercollection.findOne({
//         'email': email,
//         'password': sha1(password)
//     })
//     if (!userbyemailandpass) {
//         return res.status(401).json({error: 'Unauthorized'})
//     }
//     const token = uuidv4()
//     const key = `auth_${token}`
//     await redisclient.set(key, userbyemailandpass._id.toString(), 24 * 60 * 60)
//     return res.status(200).json({
//         token
//     })
// }
const getConnect = async (req, res) => {
    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(400).json({ error: 'Unauthorized' })
    }
    const decodeAuthHeader = Buffer.from(authHeader.split(' ')[1], 'base64').toString()
    const credentials = decodeAuthHeader.split(':')
    const email = credentials[0]
    const password = credentials[1]
    // find user associated with email and sha1 password
    const userCollection = await dbclient.db.collection('users')
    const userByEmailAndPass = await userCollection.findOne({
        'email': email,
        'password': sha1(password)
    })
    if (!userByEmailAndPass) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const token = uuidv4()
    const key = `auth_${token}`
    await redisclient.set(key, userByEmailAndPass._id.toString(), 24 * 60 * 60)
    return res.status(200).json({
        "token": token
    })
}

const getDisconnect = async (req, res) => {
    const token = req['authorization']
    const theuserid = await redisclient.get(`auth_${token}`)
    // const usercollection = dbclient.db.collection('users')
    // const finduserbyid = await usercollection.findOne({
    //     _id: theuserid
    // })
    if (!theuserid) {
        return res.status(401).json({
            error: 'Unauthorized'
        })
    }
    await redisclient.del(`auth_${token}`)
    return res.status(200)
}
module.exports = { getConnect, getDisconnect }
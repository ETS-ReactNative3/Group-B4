const { equal } = require('assert')
let express = require('express')
let router = express.Router()
let jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const auth = (req, res, next) => {
    let auth = req.headers.authorization
    console.log('IN AUTH')
    console.log(req)
    console.log('AUTH LINE 12')
    let jwt_index = auth.indexOf('jwt=')
    if (jwt_index === -1) {
        console.log('authenticate.js line 14')
        res.status(401).send()
        return
    }
    auth = auth.substring(jwt_index)
    auth_arr = auth.split(';')

    for (cookie in auth) {
        if (cookie.indexOf('jwt=') !== -1) {
            auth = cookie
            break
        }
    }
    let broken = auth.split('=')
    let token = broken[1]

    jwt.verify(token, process.env.SALT_HASH, function (err, decoded) {
        if (err) {
            console.log(err)
            console.log('Authenticate.js line 33')
            res.status(401).send()
            return
        }
        if (decoded.usr === req.query.username || decoded.usr === req.body.username) {
            const now = new Date()
            const seconds = Math.round(now.getTime() / 1000)

            if (seconds > decoded.exp) {
                console.log('Authenticate.js line 42')
                res.satus(401).send('unauthorized - expired!')
                return
            }
            next()
        } else {
            console.log(decoded.usr)
            console.log(req.query.username)
            console.log('authenticate.js line 48')
            res.status(401).send('unauthorized - not matching!')
            return
        }
    })
    //middleware to handle authentication
}

module.exports = auth

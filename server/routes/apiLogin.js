const express = require('express')
const router = express.Router()
const app = express()
const bcrypt = require('bcrypt')
const Login = require('../model/Login')
const { API_KEY } = require('../constants')

router.post('/', (req, res) => {
  const {
    apiKey,
    email,
    password
   } = req.body

  if(API_KEY !== apiKey) {
   res.status(400)
   res.json({code: "VIBES_BAD_API_KEY", message: "Bad API key"})
  }

  if(API_KEY === apiKey) {
    Login.findOne({email}, (err, user) => {
      if(err) {
        res.status(400)
        res.json({code: "VIBES_NOT_AVAILABLE", message: "Une opération de maintenance est en cours. Veuillez nous excuser pour la gêne occasionnée, on revient vite!"})
      } else {
        if(user) {
          bcrypt.compare(password, user.password, (err, result) => {
            if(result === true) {
              res.status(200)
              res.json({userId: user._id, userToken: '', lastActiveDate: '', refreshToken: ''})
            } else {
              res.status(400)
              res.json({code: "VIBES_BAD_LOGPWD", message: "Identifiants non reconnus"})
            }
          })
        } else {
          res.status(400)
          res.json({code: "VIBES_BAD_LOGPWD", message: "Identifiants non reconnus"})
        }
      }
    })
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const Profile = require('../ProfileSchema')
const SignUp = require('../UserSchema')
const authenticateToken = require('./Authenticate')
require('dotenv').config()
const AWS = require('aws-sdk')
const profileController = require('../controllers/profileController')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY

})


router.post('/:id',profileController.postProfileById)

router.use(authenticateToken)

router.get('/',profileController.getUserProfile)

router.get('/:id',profileController.getOtherProfileById)

module.exports = router;
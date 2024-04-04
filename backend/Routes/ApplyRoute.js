const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const Profile = require('../ProfileSchema')
const MyJob = require('../JobSchema')
const Job = require('../TempJobSchema')
const { User } = require('../TempUserSchema')
const Application = require('../TempFormSchema')
const Form = require('../FormSchema')
const authenticateToken = require('./Authenticate')
const multer = require('multer')
const applyController = require('../controllers/applyController')
require('dotenv').config()

const upload = multer({ dest: 'uploads/' });
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY

})


router.use(authenticateToken)

router.get('/:id',applyController.getApplyById)

router.post('/:id', upload.single('resume') ,applyController.postApplicationById) 

router.delete('/:id',applyController.deleteApplicationById)




module.exports = router;
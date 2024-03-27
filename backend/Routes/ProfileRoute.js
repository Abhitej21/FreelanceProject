const express = require('express')
const router = express.Router()
const Profile = require('../ProfileSchema')
const SignUp = require('../UserSchema')
const authenticateToken = require('./Authenticate')
require('dotenv').config()
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY

})

router.get('/',authenticateToken,async (req,res) => {
    const {username} = req.user 
    res.send(req.user)
  })
  

router.get('/:id',authenticateToken,async(req,res) => {
    const {id}  = req.params
    let signData = await SignUp.findOne({username: id})
    if(signData === null){
      res.send({data: {isNull: true}})
    }
    else{
      let prevData = await Profile.findOne({username:id})
      prevData = prevData === null?{username:req.user.username}:prevData
      res.send({data:prevData,username: req.user.username,userId: id})
    }
    
  })
  

  router.post('/:id',async(req,res) => {
    const userDetails = req.body
    const {username,firstname,lastname,org,email,skills,bio,dob,phone,about,location,github,linkedin,profileUrl } = userDetails
    let prevDetails = {}
    console.log(profileUrl)
    prevDetails.username = username
    prevDetails.firstName = firstname 
    prevDetails.lastName = lastname
    prevDetails.org = org 
    prevDetails.email = email 
    prevDetails.userSkills = skills 
    prevDetails.dob = dob 
    prevDetails.phone = phone 
    prevDetails.userBio = bio
    prevDetails.userAbout = about 
    prevDetails.location = location 
    prevDetails.github = github 
    prevDetails.linkedin = linkedin 
    prevDetails.profileUrl = profileUrl!==""?profileUrl:'https://res.cloudinary.com/da7y99axc/image/upload/v1709389286/dkvz3tcsezlnevxlgmft.jpg'
    console.log(profileUrl)
    try {
      const isExist = await Profile.findOne({username})
      
      if(isExist===null){
        const addUser = new Profile(prevDetails)
        addUser.save().then((result) => res.send(result)).catch((err) => res.send(err))
      }
      else{
        const user = await Profile.findOneAndUpdate({username}, prevDetails);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: ``,
          Body: JSON.stringify(prevDetails),
          ACL: 'public-read',
          ContentType: 'application/json'
        }
        res.json({ message: 'User email updated successfully', user });
      }

  } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
    
})

module.exports = router;
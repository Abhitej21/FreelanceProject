const express = require('express')
const router = express.Router()
const Profile = require('../ProfileSchema')
const SignUp = require('../UserSchema')

require('dotenv').config()
const AWS = require('aws-sdk')


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})


// TESTING DONE FOR THIS ROUTE 
exports.getProfileforCard = async (req,res) => {
  const {username} = req.user 
  const prevData = await SignUp.findOne({username})
  const prevProfile = await Profile.findOne({username})
  
  if(!prevProfile){
    // res.send({addProfile: true})
      res.send(prevData)
  }
  else{
      res.send(prevProfile)
  }

}

exports.postProfileById = async(req,res) => {
    const userDetails = req.body
    const {username,firstname,lastname,org,email,userSkills,userBio,dob,phone,userAbout,location,github,linkedin,profileUrl } = userDetails
    let prevDetails = {}
    prevDetails.username = username
    prevDetails.firstName = firstname 
    prevDetails.lastName = lastname
    prevDetails.org = org 
    prevDetails.email = email 
    prevDetails.userSkills = userSkills 
    prevDetails.dob = dob 
    prevDetails.phone = phone 
    prevDetails.userBio = userBio
    prevDetails.userAbout = userAbout 
    prevDetails.location = location 
    prevDetails.github = github 
    prevDetails.linkedin = linkedin 
    prevDetails.profileUrl = profileUrl!==""?profileUrl:'https://res.cloudinary.com/da7y99axc/image/upload/v1711741848/profile-icon-png-898_bezbbd.png'
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
        res.json({ message: 'User profile updated successfully', user });
      }
  
  } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
    
  }



// TESTING DONE FOR THIS ROUTE 
exports.getUserProfile = async (req,res) => {
    const {username} = req.user 
    const prevProfile = await Profile.findOne({username})
    if(prevProfile === null){
      res.send({addProfile: true,username})
    }
    else
    res.send(req.user)
}



// TESTING DONE FOR THIS ROUTE
exports.getOtherProfileById = async(req,res) => {
    const {id}  = req.params
    let signData = await SignUp.findOne({username: id})
    if(signData === null){
      res.send({data: {isNull: true}})
    }
    else{
      let prevData = await Profile.findOne({username:id})
      prevData = prevData === null?{username:req.user.username}:prevData
      res.send({data:prevData,username: req.user.username,userId: id,email: signData.email})
    }
    
}



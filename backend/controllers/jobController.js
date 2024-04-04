const express = require('express')
const router = express.Router()
const Profile = require('../ProfileSchema')
const SignUp = require('../UserSchema')
const Like = require('../LikeSchema')
const Job = require('../TempJobSchema')
const Application = require('../TempFormSchema')
const { User } = require('../TempUserSchema')
const mongoose = require('mongoose')
const {config} = require('dotenv') 
const Form = require('../FormSchema')
const MyJob = require('../JobSchema')
const {Invitation} = require('../InvitationSchema')

config()


// TESTING DONE FOR THIS ROUTE
exports.getSaved = async (req,res) => {
    const {username} = req.user 
    const prevData = await Like.findOne({username})
    const profileData = await Profile.findOne({username})
    prevData.profileData = profileData
    res.send(prevData)
}

// TESTING DONE FOR THIS ROUTE 
exports.getLatest = async (req,res) => {
    const data = await Job.find()
    const recruiters = await User.find()
    const sendData = data.map((each) => {
      const recruiterData = recruiters.find(r => r._id.equals(each.postedBy))
      const newObject = {
        job: each,
        recruiter: recruiterData.firstName+" "+recruiterData.lastName,
      }
      return newObject
    })
    res.send(sendData)
  }
  // const sendData = await Promise.all(data.map(async (each) => {
  //   const recruiterData = await User.findOne({_id: each.postedBy})
  //   const newObject = {
  //     job: each,
  //     recruiter: recruiterData.firstName+" "+recruiterData.lastName,
  //   }
  //   return newObject
  // }))


// TESTING DONE FOR THIS ROUTE

exports.getInvitations = async (req,res) => {
    const {username} = req.user 
    const userData = await Profile.findOne({username})
    const invites = await Invitation.find({invitee: userData._id})
    const recruiters = await User.find()
    const sendData = invites.map((eachInvite) => {
      const recruiterData = recruiters.find(r => r._id.equals(eachInvite.inviter))
      const newObject = {
        inviteId: eachInvite._id,
        companyName: eachInvite.companyName,
        jobTitle: eachInvite.jobTitle,
        jobType: eachInvite.jobType,
        jobMode: eachInvite.jobMode,
        jobScope: eachInvite.jobScope,
        jobSalary: eachInvite.jobSalary,
        salaryType: eachInvite.salaryType,
        jobDescription: eachInvite.jobDescription,
        inviter: recruiterData && recruiterData.firstName+" "+recruiterData.lastName,
      }
      return newObject
    })
    res.status(200).send(sendData)
  }
  // const sendData = await Promise.all(invites.map(async (eachInvite) => {
  //   const recruiterData = recruiters.find(r => r._id.equals(eachInvite.inviter))
  //   // const recruiterData = await User.findOne({_id: eachInvite.inviter})
  //   const newObject = {
  //     inviteId: eachInvite._id,
  //     companyName: eachInvite.companyName,
  //     jobTitle: eachInvite.jobTitle,
  //     jobType: eachInvite.jobType,
  //     jobMode: eachInvite.jobMode,
  //     jobScope: eachInvite.jobScope,
  //     jobSalary: eachInvite.jobSalary,
  //     salaryType: eachInvite.salaryType,
  //     jobDescription: eachInvite.jobDescription,
  //     inviter: recruiterData && recruiterData.firstName+" "+recruiterData.lastName,
  //   }
  //   return newObject
  // }))  


// TESTING DONE FOR THIS ROUTE
exports.getInvitationsById = async (req,res) => {
    const id = req.params.id 
    const invitation = await Invitation.findOne({_id: id})
    res.send({value: invitation.status})
  }

// TESTING DONE FOR THIS ROUTE
exports.postInvitationById = async (req,res) => {
   await mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true})

    const {username} = req.user 
    const status = req.body.val
    const id = req.params.id 
    const invitation = await Invitation.findOneAndUpdate({_id: id},{status})
    res.status(200).send({update: true})
  
}



// TESTING DONE FOR THIS ROUTE
exports.getApplied = async (req,res) => {
    const {username} = req.user 
    const userData = await Profile.findOne({username})
    
    const data = await Application.find({appliedBy : userData._id})
    // FREELANCE JOBS

    const sendData = await Promise.all(data.map(async eachApplication => {
      const recruiterData = await  User.findOne({_id: eachApplication.recruiterId} , {firstName : 1 , lastName : 1})
      const jobPostData =  await Job.findOne({_id: eachApplication.jobId})
      const newObject = {
        applicationId: eachApplication._id,
        jobData: jobPostData,
        startDate: eachApplication.startDate,
        postedBy: recruiterData.firstName+" "+recruiterData.lastName,
        status: eachApplication.status,
        appliedAt: eachApplication.appliedAt,
      }
      return newObject
    }))
    // MY JOBS
    const formData = await Form.find({appliedBy: userData._id})
    const sendFormData = await Promise.all(formData.map(async eachForm => {
      const jobPostData = await MyJob.findOne({_id: eachForm.jobId})
      const newObject = {
        applicationId: eachForm._id,
        jobData: jobPostData,
        startDate: eachForm.startDate,
        appliedAt: eachForm.appliedAt,
      }
      return newObject 
    }))
    // console.log(sendFormData)
    res.status(200).send({data: sendData,formData: sendFormData})
  }
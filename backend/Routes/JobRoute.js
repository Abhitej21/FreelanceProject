const express = require('express')
const router = express.Router()
const Profile = require('../ProfileSchema')
const SignUp = require('../UserSchema')
const Like = require('../LikeSchema')
const Job = require('../TempJobSchema')
const Application = require('../TempFormSchema')
const { User } = require('../TempUserSchema')
const authenticateToken = require('./Authenticate')
const Form = require('../FormSchema')
const MyJob = require('../JobSchema')
const {Invitation} = require('../InvitationSchema')


router.get('/saved',authenticateToken,async (req,res) => {
    const {username} = req.user 
    const prevData = await Like.findOne({username})
    const profileData = await Profile.findOne({username})
    prevData.profileData = profileData
    res.send(prevData)
})

router.get('/latest',authenticateToken,async (req,res) => {
    const data = await Job.find()
    const sendData = await Promise.all(data.map(async (each) => {
      const recruiterData = await User.findOne({_id: each.postedBy})
      const newObject = {
        job: each,
        recruiter: recruiterData.firstName+" "+recruiterData.lastName,
      }
      return newObject
    }))
    console.log(sendData)
    // data.recruiter = recruiterData.firstName+" "+recruiterData.lastName
    res.send(sendData)
})

router.get('/invitations',authenticateToken,async (req,res) => {
  const {username} = req.user 
  const userData = await Profile.findOne({username})
  const invites = await Invitation.find({invitee: userData._id})
  const sendData = await Promise.all(invites.map(async (eachInvite) => {
    const recruiterData = await User.findOne({_id: eachInvite.inviter})
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
      inviter: recruiterData.firstName+" "+recruiterData.lastName,
    }
    return newObject
  }))

  res.status(200).send(sendData)

})

router.get('/invitations/:id',authenticateToken,async (req,res) => {
  const id = req.params.id 
  const invitation = await Invitation.findOne({_id: id})
  res.send({value: invitation.status})
})

router.post('/invitations/:id',authenticateToken,async (req,res) => {
  const {username} = req.user 
  const status = req.body.val
  const id = req.params.id 
  const invitation = await Invitation.findOneAndUpdate({_id: id},{status})
  res.status(200).send({update: true})

})

router.get('/applied',authenticateToken,async (req,res) => {
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
    res.status(200).send({data: sendData,formData: sendFormData})
  })

router.get('/',authenticateToken,async (req,res) => {
    const {username} = req.user 
    const prevData = await SignUp.findOne({username})
    const prevProfile = await Profile.findOne({username})
    if(!prevProfile){
        res.send(prevData)
    }
    else{
        res.send(prevProfile)
    }

})
router.get('/:id',authenticateToken,async (req,res) => {
    const {username} = req.user 
    const {id} = req.params 
    const prevData = await Like.findOne({username})
    const exist = (prevData.likes.find(each => each.like_id === id))
    if(exist===undefined){
      prevData.likes.push({like_id: id})
      prevData.save().then((result) => console.log(result)).catch((err) => console.log(err))
    }
    res.send(prevData)
  })

router.delete('/:id',authenticateToken,async (req,res) => {
    const {username} = req.user 
    const {id} = req.params 
    const prevData = await Like.findOne({username})
    const index = prevData.likes.findIndex(each => each.like_id === id)
    prevData.likes.splice(index,1)
    prevData.save().then((result) => console.log(result)).catch((err) => console.log(err))
    res.send(prevData)
})





module.exports = router;
const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const Profile = require('../ProfileSchema')
const MyJob = require('../JobSchema')
const Job = require('../TempJobSchema')
const { User } = require('../TempUserSchema')
const Application = require('../TempFormSchema')
const Form = require('../FormSchema')
// const authenticateToken = require('./Authenticate')
const multer = require('multer')
require('dotenv').config()

const upload = multer({ dest: 'uploads/' });
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY

})


// TESTING DONE FOR THIS ROUTE 
exports.getApplyById = async (req,res) => {
    const {username} = req.user 
    const {id} = req.params
    const prevData = await Profile.findOne({username})
  const jobPostContent = await MyJob.findOne({id: id})
       
    if(jobPostContent === null){
      const job = await Job.findOne({jobId: id})
      const appliedJobs = await Application.findOne({appliedBy: prevData._id,jobId: job._id})
      if(appliedJobs !== null){
        res.send({applied: true})
      }
      else{
      const {jobTitle,companyName,location} = job
      res.send({prevData,jobTitle,companyName,location})
      }
    }
    else{
      const {jobTitle,companyName,location,companyLogo} = jobPostContent
      res.send({prevData,jobTitle,companyName,location,companyLogo})
    }
}


exports.postApplicationById = async (req,res) => {
    if(!req.file){
      console.log("Resume is required")
      res.status(400).send("Resume is required")
    }

    const resume = req.file
    const fileStream = require('fs').createReadStream(resume.path)
    const ext = resume.originalname.split('.')[1];

const {username} = req.user 
const {id} = req.params
const prevData = await Profile.findOne({username})
const jobPostContent = await MyJob.findOne({id: id}) 
// APPLY FOR FREELANCE JOB POST
if(jobPostContent === null){
    const freelanceJob = await Job.findOne({jobId: id})
    const {startDate} = req.body
    const applicantData = {
    startDate: new Date(startDate),
    jobId: freelanceJob._id,
    appliedBy: prevData._id,
    recruiterId: freelanceJob.postedBy,
    }
    const recruiterData= await User.findOne({_id: freelanceJob.postedBy})
    const addApplication = new Application(applicantData)
    addApplication.save().then((result) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
        user: process.env.MY_MAIL,
        pass: process.env.MY_PASS,
        }
    })
    const name = prevData.username.charAt(0).toUpperCase()+prevData.username.substring(1)
    const html = `
        <p>Hi ${name},</p>
        <p>Thankyou for applying for the position of ${freelanceJob.jobTitle} at ${freelanceJob.companyName}.
        We have received your application and your application id is <strong>${result._id}</strong>.
        </p>
        <p>Regards,</p>
        <p>${recruiterData.firstName+" "+recruiterData.lastName}.</p>
    `
    const mail = {
        from: process.env.MY_MAIL,
        to: prevData.email,
        subject: 'Application Submitted Successfully',
        html: html 
    };
    transport.sendMail(mail,(error,info) => {
        if(error){
            console.log(error);
        }
        else{
            console.log('Email sent:'+ info.response);
        }
    })

    // UPLOAD RESUME TO S3 BUCKET 
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Body: fileStream,
      ACL: 'public-read',
      Key: `${result._id}.${ext}`,
      ContentType : resume.mimetype

    }
    s3.upload(params,(err,data) => {
      if(err){
        console.log(err)
        res.status(500).send(err)
      }
      else
      console.log("File Uploaded Successfully",data.Location)
  // res.send({message: "File uploaded to s3",location: data.Location})
    })
    res.send(result)
    }).catch((err) => res.send(err))
}
// APPLY FOR  MYJOBS
else{
    const {startDate} = req.body 
    const applicantData = {
        startDate: startDate,
        jobId: jobPostContent._id,
        appliedBy: prevData._id,
    }
    const addApplication = new Form(applicantData)
    addApplication.save().then((result) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
        user: process.env.MY_MAIL,
        pass: process.env.MY_PASS,
        }
    })
    const name = prevData.username.charAt(0).toUpperCase()+prevData.username.substring(1)
    const html = `
        <p>Hi ${name},</p>
        <p>Thankyou for applying for the position of ${jobPostContent.jobTitle} at ${jobPostContent.companyName}.
        We have received your application and your application id is <strong>${result._id}</strong>.
        We appreciate your interest in a career at ${jobPostContent.companyName}. You will receive more updates
        from us soon.
        </p>
        <p>Regards,</p>
        <p>JobStreet Recruiting</p>
    `
    const mail = {
        from: process.env.MY_MAIL,
        to: prevData.email,
        subject: 'Application Submitted Successfully',
        html: html 
    };
    transport.sendMail(mail,(error,info) => {
        if(error){
            console.log(error);
        }
        else{
            console.log('Email sent:'+ info.response);
        }
    })
       // UPLOAD RESUME TO S3 BUCKET 
       console.log(result._id)
       const params = {
        Bucket: process.env.BUCKET_NAME,
        Body: fileStream,
        ACL: 'public-read',
        Key: `${result._id}.${ext}`,
        ContentType : resume.mimetype
  
      }
      s3.upload(params,(err,data) => {
        if(err){
          console.log(err)
          res.status(500).send(err)
        }
        else
        console.log("File Uploaded Successfully",data.Location)
    // res.send({message: "File uploaded to s3",location: data.Location})
      })
    res.send(result)
    }).catch((err) => res.send(err))
  }
}


exports.deleteApplicationById = async (req,res) => {
    const applicationId = req.params.id 
    const {username} = req.user 
    const prevData = await Profile.findOne({username})
    
    try {

      const toBeDeleted = await Form.findOne({_id: applicationId}) 
      // DELLETE MYJOBS APPLICATION
      if(toBeDeleted !== null){
         const job = await MyJob.findOne({_id: toBeDeleted.jobId})
         const deletedDocument = await Form.deleteOne({_id: applicationId})
         if (!deletedDocument) {
          return res.status(404).send({ error: 'Document not found' });
         }
         const transport = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          auth: {
            user: process.env.MY_MAIL,
            pass: process.env.MY_PASS,
          }
        })
        const name = prevData.username.charAt(0).toUpperCase()+prevData.username.substring(1)
        const html = `
          <p>Hi ${name},</p>
          <p>Your application for the position of ${job.jobTitle} at ${job.companyName}
          has been withdrawn. Stay tuned to our website for more job posts.
          </p>
          <p>Regards,</p>
          <p>Team JobStreet.</p>
        `
        const mail = {
          from: 'abhisamudrala2107@gmail.com',
          to: prevData.email,
          subject: 'Application Withdrawn Successfully',
          html: html 
        };
        transport.sendMail(mail,(error,info) => {
            if(error){
                console.log(error);
            }
            else{
                console.log('Email sent:'+ info.response);
            }
        })
        return res.status(200).send({ message: 'Document deleted successfully', deletedDocument });

      }
      // DELETE FREELANCE APPLICATION 
      else{
        const findToBeDeleted = await Application.findOne({_id: applicationId})
        const freelanceJob = await Job.findOne({_id: findToBeDeleted.jobId})
        const recruiterData= await User.findOne({_id: findToBeDeleted.recruiterId})
        const deletedDocument = await Application.deleteOne({ _id: applicationId});
        console.log("DeletedOne",deletedDocument)
        
        if (!deletedDocument) {
          return res.status(404).send({ error: 'Document not found' });
        }
        
        const transport = nodemailer.createTransport({
          service: 'gmail',
          secure: false,
          auth: {
            user: process.env.MY_MAIL,
            pass: process.env.MY_PASS,
          }
        })
        const name = prevData.username.charAt(0).toUpperCase()+prevData.username.substring(1)
        const html = `
          <p>Hi ${name},</p>
          <p>Your application for the position of ${freelanceJob.jobTitle} at ${freelanceJob.companyName}
          has been withdrawn. Stay tuned to our website for more job posts.
          </p>
          <p>Regards,</p>
          <p>${recruiterData.firstName+" "+recruiterData.lastName}.</p>
        `
        const mail = {
          from: 'abhisamudrala2107@gmail.com',
          to: prevData.email,
          subject: 'Application Withdrawn Successfully',
          html: html 
      };
      transport.sendMail(mail,(error,info) => {
          if(error){
              console.log(error);
          }
          else{
              console.log('Email sent:'+ info.response);
          }
      })
      return res.status(200).send({ message: 'Document deleted successfully', deletedDocument });
    }
    
  }catch (error) {
      return res.status(500).send({ error: 'Internal server error' });
    }
  }
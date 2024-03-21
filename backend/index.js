const express = require('express')
const cors = require('cors')
const app = express()
const {Server} = require('socket.io')
const http = require('http')
const mongoose = require('mongoose')
const {Types} = require('mongoose')
const SignUp = require('./UserSchema')
const Like = require('./LikeSchema')
const Profile = require('./ProfileSchema')
const jwt = require('jsonwebtoken')
const FreelanceJob = require('./JobSchema')
const Job = require('./TempJobSchema')
// const Job = require('./JobSchema')
const multer = require('multer')
const nodemailer = require('nodemailer')
const { User } = require('./TempUserSchema')
const DBURL = 'mongodb+srv://myAtlasDBUser:anits123@myatlasclusteredu.fl0osbw.mongodb.net/Career-crafter'
const Application = require('./TempFormSchema')
const Form = require('./FormSchema')

const {S3Client,DeleteObjectCommand,GetObjectCommand, ListObjectsCommand, PutObjectCommand}=require('@aws-sdk/client-s3');
const {Upload}=require('@aws-sdk/lib-storage')
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const { htmlPrefilter } = require('jquery')


const server = http.createServer(app)
// server.listen(8000,() => {
//   console.log('server listening on http://localhost')
// })

const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
  }
})
// const DBURL = 'mongodb+srv://myAtlasDBUser:abhi123@myatlasclusteredu.bfuqmjy.mongodb.net/myproject'

// websocket connection 
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)
    
})

const changeStream = FreelanceJob.watch() 
    changeStream.on('change',(change)  => {
      if(change.operationType === 'insert'){
          const msg = "NEW JOB POST ADDED"
          console.log(msg)
          // console.log(change)
          const sendData = {
            wallTime: change.wallTime,
            document: change.fullDocument,
          }
          io.emit('message',change)
      }
    })



const verifyAccessToken = (token) => {
  const secret = 'ABHITEJA123';

  try {
    const decoded =  jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function  authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.sendStatus(401);
    }
    
    const result =  verifyAccessToken(token);
    
    if (!result.success) {
      return res.status(403).json({ error: result.error });
    }
  
    req.user = result.data;
    next();
}

app.use(cors())
app.use(express.json())

mongoose.connect(DBURL,{useNewUrlParser: true,useUnifiedTopology: true})
.then((res) => {
  server.listen(8000);
  console.log("Connected to Server 8000");
}).catch((err) => console.log(err))


async function insertData() {
  try {
    // await Job.insertMany(jobPosts);
    await FreelanceJob.insertMany(jobPosts);
    console.log('Data inserted into MongoDB');
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
  } finally {
    // Close the connection
    mongoose.disconnect();
  }
}
app.post('/signup',async(req,res) => {
    const newUser = req.body
    newUser.profileUrl = 'https://res.cloudinary.com/da7y99axc/image/upload/v1709389286/dkvz3tcsezlnevxlgmft.jpg'
    const addUser = new SignUp(newUser)
    addUser.save().then((result) => res.send(result)).catch((err) => res.send(err))
    // insertData()

  })

app.get('/sendmail',async (req,res) => {
    
})


app.get('/profile/:id',authenticateToken,async(req,res) => {
  const {id}  = req.params
  console.log(req.params)
  console.log("HI",id)
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

app.get('/image',authenticateToken,async (req,res) => {
    const {username}  = req.user
    let prevData = await Profile.findOne({username})
    const {firstName,lastName,userBio,profileUrl} = prevData || {}
    // console.log(prevData)
    res.send({firstName,lastName,userBio,profileUrl,username})
})


app.post('/profile/:id',async(req,res) => {
    const userDetails = req.body
    // console.log(userDetails)
    const {username,firstname,lastname,org,email,skills,bio,dob,phone,about,location,github,linkedin,profileUrl } = userDetails
    // console.log(profileUrl)
    let prevDetails = {}
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
        res.json({ message: 'User email updated successfully', user });
      }
      
  } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
    
})

app.get('/jobs/:id',authenticateToken,async (req,res) => {
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

app.get('/savedjobs',authenticateToken,async (req,res) => {
  const {username} = req.user 
  const prevData = await Like.findOne({username})
  const list = prevData.likes
  res.send(prevData)
})

app.delete('/jobs/:id',authenticateToken,async (req,res) => {
  const {username} = req.user 
  const {id} = req.params 
  const prevData = await Like.findOne({username})
  const index = prevData.likes.findIndex(each => each.like_id === id)
  prevData.likes.splice(index,1)
  prevData.save().then((result) => console.log(result)).catch((err) => console.log(err))
  res.send(prevData)
})
app.get('/jobs',authenticateToken,async (req,res) => {
    // res.status(200).send(req.user)
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

app.get('/apply/:id',authenticateToken,async (req,res) => {
  const {username} = req.user 
  const {id} = req.params
  const prevData = await Profile.findOne({username})
//   const jobPostContent = await Job.findOne({id: id})
const jobPostContent = await FreelanceJob.findOne({id: id})
     
  if(jobPostContent === null){
    const freelanceJob = await Job.findOne({jobId: id})
    const appliedJobs = await Application.findOne({appliedBy: prevData._id,jobId: freelanceJob._id})
    if(appliedJobs !== null){
      console.log(appliedJobs)
      res.send({applied: true})
    }
    else{
    const {jobTitle,companyName,location} = freelanceJob
    res.send({prevData,jobTitle,companyName,location})
    }
  }
  else{
    const {jobTitle,companyName,location} = jobPostContent
    res.send({prevData,jobTitle,companyName,location})
  }
})

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

const ACCESS_KEY = 'AKIA5FTY6YDJXZHMGW4G'
const SECRET_KEY = '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'

const s3 = new S3Client({
  region : 'ap-south-1',
  credentials:{
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  }
})

const bucketName = "abhiteja-temp"

app.post('/apply/:id',authenticateToken,  async (req,res) => {
  // if(req.resume){
  //   return res.status(400).send("Resume is required")
  // }
  // const resume = req.resume;

  // const ext = resume.originalFilename.split('.')[1];
  // const params = {
  //   Bucket: bucketName,
  //   Body: resume.buffer,
  //   Key: `${req.user.username}_resume.${ext}`,
  //   ContentType : resume.mimeType
  // }

  // const uploadCommand = new PutObjectCommand(params);
  // try{
  //   const result = await s3.send(uploadCommand);
  //   console.log(result);
  //   return res.statusCode(200);
  // }
  // catch(err){
  //   return res.status(500).send(err);
  // }
  const {username} = req.user 
  const {id} = req.params
  const prevData = await Profile.findOne({username})
  const jobPostContent = await FreelanceJob.findOne({id: id}) 
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
      console.log("status: ",result._id)
      const transport = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
          user: 'abhisamudrala2107@gmail.com',
          pass: 'vtcy spis pmwe uvba',
        }
      })
      console.log(recruiterData.firstName)
      console.log(prevData.email)
      const html = `
        <p>Hi ${prevData.username},</p>
        <p>Thankyou for applying for the position of ${freelanceJob.jobTitle} at ${freelanceJob.companyName}.
         We have received your application and your application id is <strong>${result._id}</strong>.
        </p>
        <p>Regards,</p>
        <p>${recruiterData.firstName+" "+recruiterData.lastName}.</p>
      `
      const mail = {
        from: 'abhisamudrala2107@gmail.com',
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
    // console.log("Mail sent successfully")
      res.send(result)
    }).catch((err) => res.send(err))
  }
  else{
    const {startDate} = req.body 
    const applicantData = {
       startDate: startDate,
       jobId: jobPostContent._id,
       appliedBy: prevData._id,
    }
    // const recruiterData = await User.findOne({_id: jobPostContent.postedBy})
    const addApplication = new Form(applicantData)
    addApplication.save().then((result) => {
      const transport = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
          user: 'abhisamudrala2107@gmail.com',
          pass: 'vtcy spis pmwe uvba',
        }
      })
      console.log(prevData.email)
      const html = `
        <p>Hi ${prevData.username},</p><br/><br/>
        <p>Thankyou for applying for the position of ${jobPostContent.jobTitle} at ${jobPostContent.companyName}.
         We have received your application and your application id is <strong>${1234}</strong>.
        </p><br/><br/>
        <p>Regards,</p><br/>
        <p>Abhiteja Samudrala.</p>
      `
      const mail = {
        from: 'abhisamudrala2107@gmail.com',
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
      res.send(result)
    }).catch((err) => res.send(err))
  }
}) 

app.post('/login',async (req,res) => {
    const {username,password} = req.body 
    const prevData = await SignUp.findOne({username})
    if(prevData === null){
        res.send({userExists: false})
    }
    else if(password !== prevData.password){
        res.send("Password not match")
    }
    else{
        const id = prevData._id
        const token = jwt.sign({username,id},'ABHITEJA123',{expiresIn: '5h'})
        const prevUserLikes = await Like.findOne({username})
        if(prevUserLikes === null){
          const newUserLike = new Like({
            username: username,
            likes: [],
          })
          newUserLike.save().then((result) => console.log(result)).catch((err) => console.log(err))
        }
        res.send({token})
    }
     
})

app.get('/profile',authenticateToken,async (req,res) => {
  const {username} = req.user 
  res.send(req.user)
})


app.get('/latestjobs',authenticateToken,async (req,res) => {
    const {username} = req.user 
    const data = await Job.find()
    res.send(data)
})


app.get('/appliedjobs',authenticateToken,async (req,res) => {
  const {username} = req.user 
  const userData = await Profile.findOne({username})
  const data = await Application.find({appliedBy : userData._id})

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
  res.status(200).send({data: sendData})
})


app.delete('/withdraw/:id',authenticateToken,async (req,res) => {
  const applicationId = req.params.id 
  try {
    const deletedDocument = await Application.deleteOne({ _id: applicationId});
    if (!deletedDocument) {
      return res.status(404).send({ error: 'Document not found' });
    }
    return res.status(200).send({ message: 'Document deleted successfully', deletedDocument });
  } catch (error) {
    return res.status(500).send({ error: 'Internal server error' });
  }
})
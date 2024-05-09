const jobsData = require("./data")
const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const multer = require('multer')
require('dotenv').config()
const nodemailer = require('nodemailer')
const path = require('path')

const SignUp = require('./UserSchema')
const Profile = require('./ProfileSchema')
const Like = require('./LikeSchema')
const MyJob = require('./JobSchema')
const authenticateToken = require('./Routes/Authenticate')
const Notify = require('./NotificationSchema')

const {S3Client}=require('@aws-sdk/client-s3');

const applyRoute = require('./Routes/ApplyRoute')
const profileRoute = require('./Routes/ProfileRoute')
const jobRoute = require('./Routes/JobRoute')

const DBURL = process.env.MONGO_URI

const {Server} = require('socket.io')
const server = http.createServer(app)

const io = new Server(server,{
  cors: {
    origin: ["http://localhost:3000",'https://admin.socket.io'],
    methods: ["GET", "POST", "PUT"],
  }
})

// websocket connection 
io.on('connection', (socket) => {
    console.log(`User connected:`,socket.id)
})

const changeStream = MyJob.watch() 
    changeStream.on('change',async (change)  => {
      if(change.operationType === 'insert'){
          const {wallTime,fullDocument} = change 
          const {companyName,companyLogo} = fullDocument 
        const newNotify = new Notify({time: wallTime, name: companyName,image: companyLogo})
        newNotify.save().then((result) => console.log(result)).catch((error) => console.log(error))
        io.emit('message',change)
      }
})

mongoose.connect(DBURL,{useNewUrlParser: true,useUnifiedTopology: true})
.then((res) => {
  server.listen(8000);
  console.log("Connected to Server 8000");
}).catch((err) => console.log(err))


// app.listen(8080,() => {
//   console.log("Server listening on port 8000")
// })


app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')));
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.use('/apply',applyRoute)
app.use('/profile',profileRoute)
app.use('/jobs',jobRoute)




// async function insertData() {
//   try {
//     await MyJob.insertMany(jobsData);
//     console.log('Data inserted into MongoDB');
//   } catch (error) {
//     console.error('Error inserting data into MongoDB:', error);
//   } finally {
//     // Close the connection
//     mongoose.disconnect();
//   }
// }


app.get('/job-posts',(req,res) => {
  res.send({message: 'Success'})
})
app.post('/signup',async(req,res) => {
    const newUser = req.body
    const hashedPassword = await bcrypt.hash(newUser.password,10)
    const prevUser = await SignUp.findOne({username: newUser.username})
    const prevMailUser = await SignUp.findOne({email: newUser.email})
    if(prevUser !== null){
      res.send({alreadyExists: true})
      return;
    }
    if(prevMailUser !== null){
      res.send({mailExists: true})
      return;
    }
    if(newUser.password !== newUser.confirm){
      res.send({passwordMatch: false})
      return;
    }
    else{
    const signUpDetails = {
      ...req.body,
      password: hashedPassword,
      profileUrl: 'https://res.cloudinary.com/da7y99axc/image/upload/v1711741848/profile-icon-png-898_bezbbd.png',
    }
    const addUser = new SignUp(signUpDetails)
    addUser.save().then((result) => {console.log(res) 
      res.send(result)}).catch((err) => res.send(err))
    // insertData()
    }

  })


app.get('/image',authenticateToken,async (req,res) => {
    const {username}  = req.user
    let prevData = await Profile.findOne({username})
    // console.log('Hey',prevData)
    const {firstName,lastName,userBio,profileUrl} = prevData || {}
    res.send({firstName,lastName,userBio,profileUrl,username})
})


const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

const ACCESS_KEY = process.env.AWS_ACCESS_KEY
const SECRET_KEY = process.env.AWS_SECRET_KEY

const s3 = new S3Client({
  region : process.env.REGION,
  credentials:{
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  }
})


app.post('/login',async (req,res) => {
    const {username,password} = req.body 
  console.log(username,password)
    const prevData = await SignUp.findOne({username})
    if(prevData === null){
        res.send({userExists: false})
        return
    }
    const isOk = await bcrypt.compare(password,prevData.password)
    if(!isOk){
        res.send({password: false})
    }
    else{
        const id = prevData._id
        const token = jwt.sign({username,id},process.env.PAYLOAD_SECRET_KEY,{expiresIn: '5h'})
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


app.post('/forgot-password',async (req,res) => {
  const {email} = req.body
  const prevData = await SignUp.findOne({email})
  if(prevData === null){
      res.send({userExists: false})
      return
  }
  const token = jwt.sign({id: prevData._id},'jwt_secret_key',{expiresIn: '5h'})

  const transport = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
    user: process.env.MY_MAIL,
    pass: process.env.MY_PASS,
    }
})
const name = prevData.username.charAt(0).toUpperCase()+prevData.username.substring(1)
// const link = `http://localhost:3000/reset-password/${prevData._id}/${token}`
const link = `https://freelanceproject-1.onrender.com/reset-password/${prevData._id}/${token}`

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <p>Hi ${name}</p>
  <p>Click the button to reset your password.</p>
  <a href=${link} style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border: none; border-radius: 5px; cursor: pointer;">Reset Your Password</a>
  <p>Regards,</p>
  <p>JobStreet</p>
</body>
</html>
`;
const mail = {
    from: process.env.MY_MAIL,
    to: email,
    subject: 'Reset Your Password',
    html: html 
};
transport.sendMail(mail,(error,info) => {
    if(error){
        console.log(error);
    }
    else{
        console.log('Email sent:'+ info.response);
        res.send({message: 'Success'})
    }
})
  res.send({token})
})




app.post('/reset-password/:id/:token',async (req,res) => {
  const {id,token} = req.params 
  const {password} = req.body 
  jwt.verify(token,"jwt_secret_key",async (err,payload) => {
    // if(err){
    //   console.log(err)
    // }
    // else{
      const hash = await bcrypt.hash(password,10)
      const data = await SignUp.findByIdAndUpdate({_id: id},{password: hash,confirm: password})
      if(data){
        res.send({message: 'Success'})
      }
      else{
        console.log(err)
      }
    // }
  })

})

app.get('/notifications',async (req,res) => {
    const prevData = await Notify.find({})
    res.send(prevData)
})

module.exports = app 
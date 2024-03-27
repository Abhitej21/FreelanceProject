const jobsData = require("./data")
const express = require('express')
const cors = require('cors')
const app = express()
const {Server} = require('socket.io')
const http = require('http')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const multer = require('multer')
require('dotenv').config();

const SignUp = require('./UserSchema')
const Profile = require('./ProfileSchema')
const Like = require('./LikeSchema')
const MyJob = require('./JobSchema')
const authenticateToken = require('./Routes/Authenticate')

const {S3Client,DeleteObjectCommand,GetObjectCommand, ListObjectsCommand, PutObjectCommand, ListBucketInventoryConfigurationsOutputFilterSensitiveLog}=require('@aws-sdk/client-s3');
const {Upload}=require('@aws-sdk/lib-storage')
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const { htmlPrefilter } = require('jquery')

const applyRoute = require('./Routes/ApplyRoute')
const profileRoute = require('./Routes/ProfileRoute')
const jobRoute = require('./Routes/JobRoute')


const DBURL = process.env.MONGO_URI

// const upload = multer({ storage: storage })



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
// const DBURL = 


// websocket connection 
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)
  
    
})

const changeStream = MyJob.watch() 
    changeStream.on('change',(change)  => {
      if(change.operationType === 'insert'){
          const msg = "NEW JOB POST ADDED"
          const sendData = {
            wallTime: change.wallTime,
            document: change.fullDocument,
          }
          console.log(change)
          io.emit('message',change)
      }
    })


app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use('/apply',applyRoute)
app.use('/profile',profileRoute)
app.use('/jobs',jobRoute)


mongoose.connect(DBURL,{useNewUrlParser: true,useUnifiedTopology: true})
.then((res) => {
  server.listen(8000);
  console.log("Connected to Server 8000");
}).catch((err) => console.log(err))


async function insertData() {
  try {
    await MyJob.insertMany(jobsData);
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
    const hashedPassword = await bcrypt.hash(newUser.password,10)
    // console.log(hashedPassword)
    const signUpDetails = {
      ...req.body,
      password: hashedPassword,
      profileUrl: 'https://res.cloudinary.com/da7y99axc/image/upload/v1709389286/dkvz3tcsezlnevxlgmft.jpg',
    }
    const addUser = new SignUp(signUpDetails)
    addUser.save().then((result) => res.send(result)).catch((err) => res.send(err))
    // insertData()

  })

app.get('/sendmail',async (req,res) => {
    
})


app.get('/image',authenticateToken,async (req,res) => {
    const {username}  = req.user
    let prevData = await Profile.findOne({username})
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
    const prevData = await SignUp.findOne({username})
    console.log(prevData)
    if(prevData === null){
        res.send({userExists: false})
        return
    }

    // console.log(password,prevData.password)
    const isOk = await bcrypt.compare(password,prevData.password)
    console.log(isOk)
    if(!isOk){
        res.send({password: false})
    }
    else{
        const id = prevData._id
        // console.log("HELLO",username,id,process.env.PAYLOAD_SECRET_KEY)
        const token = jwt.sign({username,id},process.env.PAYLOAD_SECRET_KEY,{expiresIn: '5h'})
        // console.log(token)
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





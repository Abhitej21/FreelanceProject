const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk')
const path = require('path');
const { request } = require('http');
const {S3Client,DeleteObjectCommand,GetObjectCommand, ListObjectsCommand}=require('@aws-sdk/client-s3');
const {Upload}=require('@aws-sdk/lib-storage')
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')
require('dotenv').config()

const app = express() 


app.listen(8080,() => {
    console.log('server listening on http://localhost:8080')
})

const ACCESS_KEY = process.env.AWS_ACCESS_KEY 
const SECRET_KEY = process.env.AWS_SECRET_KEY


const storage = multer.memoryStorage()


const upload = multer({storage})



app.set(express.urlencoded({extended : true}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/upload', upload.single('fileInput'), (req,res)=>{
 
    if(!req.body.fileName.trim()){
        res.send({
            success:false,
            error:'Invalid file name'
        })
    }
    if(!req.file||!req.file.buffer){
        res.send({
            success:false,
            error:'Invalid file'
        })
    }
   const s3Client=new S3Client({
    credentials:{
        accessKeyId:ACCESS_KEY,
        secretAccessKey:SECRET_KEY,
    },
    region:process.env.REGION,
   });
   new Upload({
    client:s3Client,
    params:{
        Bucket:process.env.BUCKET,
        Key:`${req.body.fileName}`,
        Body:req.file.buffer,
        ContentType:req.file.mimetype,
    }
   })
   .done()
   .then(data=>{
    res.send({
        success:true,
        ...data
    });
   })
   .catch(err=>{
    res.send({
        success:false,
        ...err
    })
   })
})
  
app.get('/listFiles', async (req, res) => {
    const command = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME 
    });
    const s3Client=new S3Client({
        credentials:{
            accessKeyId:ACCESS_KEY,
            secretAccessKey:SECRET_KEY,
        },
        region:process.env.REGION,
       });
    const response = await s3Client.send(command);
    let fileURLs = []
    response.Contents.forEach(async (content) =>  {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key : content.Key
        }
        const command = new GetObjectCommand(params);
 
        const url = await getSignedUrl(s3Client, command, {expiresIn : 3600});
        fileURLs.push(url);
 
    });
    res.send({response, fileURLs});
})

app.delete('/delete/:key', async (req, res) => {
    if(!req.params.key) {
        res.send({
            success : false,
            error : 'missing file'
        })
    }
 
    const s3Client=new S3Client({
        credentials:{
            accessKeyId:ACCESS_KEY,
            secretAccessKey:SECRET_KEY,
        },
        region:process.env.REGION,
       });
    const input = {
        Bucket:process.env.BUCKET_NAME,
        Key : req.params.key
    }
 
    const command = new DeleteObjectCommand(input)
    const response = s3Client.send(command);
    res.send(response);
})


 



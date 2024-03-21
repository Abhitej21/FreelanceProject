const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const {v4 : uuidv4} = require('uuid');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/')
    },
    filename: function (req, file, cb) {
      const unique = uuidv4() 
      cb(null,unique+path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

module.exports = upload 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/file/upload', upload.single('file'), (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(3001,()=> {
  console.log("Server is listening on port 3000")
})
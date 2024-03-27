const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    jobTitle: {type: String,required: true},
    companyName: {type: String,require: true},
    jobSalary: {type: String,required: true},
    companyLogo: {type: String,required: true},
    jobType: {type: String,required: true},
    id: {type: String,required: true},
    jobDescription: {type: String,required: true},
    location: {type: String,required: true},
    rating: {type: String,required: true},
    jobMode: {type: String,required: true},
    datePosted: {type: Date,required: true},
    jobExperience: {type: String,required: true},
    postedBy: {type: String,required: true}
});



const MyJob = mongoose.model('MyJob',JobSchema);
module.exports = MyJob


const mongoose = require('mongoose')
const Schema = mongoose.Schema

const APPLICATION_STATUS = {
    PENDING : 0,
    ACCEPTED : 1,
    REJECTED : -1,
}

const FormSchema = new Schema({
    startDate: {type:Date,required: true},
    jobId: {type: mongoose.Types.ObjectId, ref : 'FreelanceJob' , required: true},
    status: {type: Number,required: true, default: APPLICATION_STATUS.PENDING},
    appliedBy: {type: mongoose.Types.ObjectId, ref: 'Profile', required: true},
    appliedAt: {type: Date, required: true, default: Date.now},
    resume: {type:String},
    coverLetter: {type:String},
})

const Form = mongoose.model('Form', FormSchema)
module.exports = Form
const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const APPLICATION_STATUS = {
    PENDING : 0,
    ACCEPTED : 1,
    REJECTED : -1,
}

const ApplicationSchema = new Schema({
    startDate: {type:Date,required: true},
    jobId: {type: mongoose.Types.ObjectId, ref : 'Job' , required: true},
    status: {type: Number,required: true, default: APPLICATION_STATUS.PENDING},
    appliedBy: {type: mongoose.Types.ObjectId, ref: 'Profile', required: true},
    appliedAt: {type: Date, required: true, default: Date.now},
    recruiterId : {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    resume: {type:String},
    coverLetter: {type:String},
})

const Application = mongoose.model('Application', ApplicationSchema)
module.exports = Application
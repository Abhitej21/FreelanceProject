const mongoose = require('mongoose')


const notifySchema = new mongoose.Schema({
    // userId: {type: mongoose.Schema.Types.ObjectId,ref: 'SignUp',req: true},
    
            image: {
                type: String,
                required: true,
                default: 'https://res.cloudinary.com/da7y99axc/image/upload/v1711899307/hand-mike-5983612_1280-removebg-preview_w2dibj.png'
            },
            name: {
                type: String,
                require:true,
            },
            
            time: {
                type: Date,
                default: Date.now()
            }
})

const Notify = mongoose.model('Notify',notifySchema)
module.exports = Notify
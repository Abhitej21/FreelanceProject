const mongoose = require('mongoose')

const LikeSchema = mongoose.Schema({
    username: {type: String,required: true},
    likes: [
        {
            like_id: {
                type: String,
                required: true,
            },
            likedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
})

const Like = mongoose.model('Like',LikeSchema)
module.exports = Like 


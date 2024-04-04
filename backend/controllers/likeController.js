const express = require('express')
const Like = require('../LikeSchema')


exports.checkLiked = async (req,res) => {
    const {username} = req.user 
    const {id} = req.params 
    let prevData = await Like.findOne({username})
    if(!prevData){
        prevData = new Like({username,likes: []})
    }
    prevData.likes.push({like_id: id})
    prevData.save().then((result) => {
        res.send(prevData)
    }).catch((err) => {
        res.status(500).send("Internal Server Error")
    })
    
}
    // const exist = (prevData.likes.find(each => each.like_id === id))
    // if(exist===undefined){
    // }

exports.removeLike = async (req,res) => {
    const {username} = req.user 
    const {id} = req.params 
    let prevData = await Like.findOne({username})
    if(!prevData){
        prevData = new Like({username,likes: []})
    }
    const index = prevData.likes.findIndex(each => each.like_id === id)
    if(index !== -1){
        prevData.likes.splice(index,1)
    }
    prevData.save().then((result) => {
        res.send(prevData)
    }).catch((err) => {
        res.status(500).send("Internal Server Error")
    })
}
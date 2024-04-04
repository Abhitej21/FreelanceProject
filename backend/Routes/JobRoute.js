const express = require('express')
const router = express.Router()
const Profile = require('../ProfileSchema')
const SignUp = require('../UserSchema')
const Like = require('../LikeSchema')
const Job = require('../TempJobSchema')
const Application = require('../TempFormSchema')
const { User } = require('../TempUserSchema')
const authenticateToken = require('./Authenticate')
const Form = require('../FormSchema')
const MyJob = require('../JobSchema')
const {Invitation} = require('../InvitationSchema')
const jobController = require('../controllers/jobController')
const likeController = require('../controllers/likeController')
const profileController = require('../controllers/profileController')

router.use(authenticateToken)

router.get('/saved',jobController.getSaved)

router.get('/latest',jobController.getLatest)

router.get('/invitations',jobController.getInvitations)

router.get('/invitations/:id',jobController.getInvitationsById)

router.post('/invitations/:id',jobController.postInvitationById)

// router.post('/temp',async (req,res) => {
//   res.send({reply: "DONE"})
// })

router.get('/applied',jobController.getApplied)



router.get('/',profileController.getProfileforCard)
router.get('/:id',likeController.checkLiked)

router.delete('/:id',likeController.removeLike)





module.exports = router;
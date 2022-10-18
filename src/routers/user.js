const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancelationEmail}=require('../emails/account')
const router=new express.Router()
const upload=multer({
    limits:{
        fileSize:1000000
    },fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error('upload a right extention for an image'))
        }
        cb(undefined,true)
        
    }
})

router.post('/users',async(req,res)=>{
    console.log(req.body);
    const user=new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})

    } catch (e) {

        res.status(400).send(e)
    }

})
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        //user is an object
        //user (behind the scene)=> JSON.stringify(user)
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((token/*object of all token in the array */)=>{
            return token.token!==req.token// if they are equal will return false and filtering it out and removing it
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        res.send()
    } catch (e) {
      res.status(500).send()  
    }
})

router.get('/users/myaccount',auth,async(req,res)=>{ 
    res.send(req.user)
})

router.patch('/users/myaccount',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidUpdate=updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidUpdate){
        res.status(404).send({"error":"Invalid input"})
    }
    try {
        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        //const user=await User.findById(req.user._id)
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)        
    }
})

router.delete('/users/myaccount',auth,async(req,res)=>{
    try{
        await req.user.remove()
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})   

router.post('/users/me/avatar', auth ,upload.single('avatar'), async (req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({"error":error.message})
})


router.get('/users/:id/avatar',async (req,res)=>{
    try{    
        const user=await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

module.exports=router
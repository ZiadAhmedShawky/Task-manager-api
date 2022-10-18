const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()

router.post('/tasks',auth,async(req,res)=>{
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)

    } catch (e) {
    
        res.status(400).send(e)
    
    }
    
})

router.get('/tasks',auth,async(req,res)=>{
    const match={}
    const sort={}
    if(req.query.compeleted/*provided*/){
        match.compeleted=req.query.compeleted==='true'
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1 // we write []=>sort[] because the user will give the name of the first property which is not find before.. not like compeleted 
    } 
    console.log(sort);

    try{
        //const tasks=await Task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),//parseInt to convert string to number
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id

    try {
        const task=await Task.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }

})

router.patch('/tasks/:id',auth,async(req,res)=>{
    
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','compeleted']
    const isValidUpdate=updates.every((update)=>allowedUpdates.includes(update))


    if(!isValidUpdate){
        res.status(400).send({"error":"Enter a valid input"})
    }
    
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update)=>task[update]=req.body[update])
        task.save()
        //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }

})   

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id})
        
        if(!task){
            return res.status(404).send({"error":"not found"})
        }

        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router
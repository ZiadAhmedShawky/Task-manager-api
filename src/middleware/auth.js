const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        //decode contains payload which is _id 
        const user=await User.findOne({_id:decode._id,'tokens.token':token})
        if(!user){
            throw new Error()//throw the error in the catch 
        }

        req.token=token //token for a specific session because we want if we logout from one device to be available in another one
             
        req.user=user//the user with the specific token 
        //req.user is the way that we will access the user in the router
        next()
    }catch(e){
        res.status(401).send({"error":"Please Authenticate"})
    }
    
}

module.exports=auth
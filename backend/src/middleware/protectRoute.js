import User from "../models/user.model";
import jwt from 'jsonwebtoken'

export const protectRoute  = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
         return   res.status(401).json({error:"{Unauthorized - no token provided"})
        }

        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
         return   res.status(401).json({error:"{Unauthorized - invalid token "})
        }

        const user =  await User.findById(decoded._id).select("-password");

        if(user){
            return res.status(404).json({error:"{User not found"})
        }

        req.user = user
        next();

    } catch (error) {
        console.log("error in protect route middleware",error.message);
        return res.status(500).json({message:"Internal server error"})
        
    }
}
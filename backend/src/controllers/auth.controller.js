import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export const signup = async (req,res)=>{
    try {
        
const {username,fullName,email,password} = req.body;

 if(username || fullName || email || password){
return res.status(400).json({error:"all fields are required"})
  }

const existingUser = await User.findOne({username});
if(existingUser){
 return res.status(400).json({error:"username already exist"})
}

const existingEmail = await User.findOne({email});
if(existingEmail){
 return res.status(400).json({error:"email already exist"})
}

const hashedPassword = await bcrypt.hash(password,10);

const newUser = new User({
    fullName,
    username,
    email,
    password:hashedPassword,
})

generateTokenAndSetCookie(newUser._id,res)

await newUser.save();

res.status(201).json({message:"User created successfully",newUser:newUser})

    } catch (error) {
        console.log("error in signup controller",error);
        
        res.status(500).json({error:"Internal server error"})
    }
}



export const login = async (req,res)=>{


    try {
        
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"all fields are required"})
        }
        const existingUser = await User.find({email});
        if(!existingUser){
            return res.status(400).json({message:"user already exists"})
        }
        const isMatch = await bcrypt.compare(password,existingUser.password);

        if(!isMatch){
              return res.status(400).json({message:"Invalid credentials"})
        }

        generateTokenAndSetCookie(existingUser._id,res);


        return res.status(200).json({message:"Logged in successfully"})


    } catch (error) {
        console.log("error in login controller",error.message);
        return res.status(500).json({message:"Internal server error"})
        
    }
}



export const logout = async (req,res)=>{

    try {
        
        res.cookie("jwt","",{maxAge:0})

        res.status(200).json({message:"Logged out successfully"})

    } catch (error) {
         console.log("error in logout controller",error.message);
        return res.status(500).json({message:"Internal server error"})
    }
}


export const getMe = async (req,res)=>{
    try {

        const user = await User.findById(req.user._id).select("-password")
        return res.status(200).json(user)

        
    } catch (error) {
        console.log("error in getMe controller");
        return res.status(500).json({message:"Internal server error"})
        
    }
}
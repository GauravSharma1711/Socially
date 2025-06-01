import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'

import cors from 'cors';

import connectDB from './utils/db.js';

import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'
import notificationRoutes from './routes/notification.route.js'

const app = express();

const PORT =  process.env.PORT || 5000

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true,
}));

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/post',postRoutes);
app.use('/api/v1/notification',notificationRoutes);

app.listen(PORT,()=>{
    connectDB()
    console.log(`server listning at ${PORT}`)
})
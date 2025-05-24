import express from 'express'
import dotenv from 'dotenv'
dotenv.config();


import authRoutes from './routes/auth.route.js'


const app = express();

const PORT =  process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth',authRoutes);


app.listen(PORT,()=>{
    console.log(`server listning at ${PORT}`)
})
import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({

    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
  to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

     type:{
        type:String,
        required:true,
        enum:["follow","like"],
    },
    read:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

const Notification = mongoose.model("Notification",notificationSchema);

export default Notification
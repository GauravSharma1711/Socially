import Notification from '../models/notification.model.js'

export const getNotiofications = async(req,res)=>{
    try {
        
        const userId = req.user._id;
const notification =  await Notification.find({to:userId})
.populate({
    path:"from",
    select:"username profileImg"
})

await Notification.updateMany({to:userId},{read:true})


response.status(200).json(notification);


    } catch (error) {
        console.log("Error in get Notifications controller",error.message);
        res.status(500).json({error:"Internal server error"})
        
    }
}


export const deleteNotiofications = async()=>{
    try {
        
    } catch (error) {
        console.log("Error in delete Notifications controller",error.message);
        res.status(500).json({error:"Internal server error"})
        
    }
}
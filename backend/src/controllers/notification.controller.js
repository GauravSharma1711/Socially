
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
        const userId = req.user._id;

        await Notification.deleteMany({to:userId});

        res.status(200).json({message:"Notification deelted successfully"})

    } catch (error) {
        console.log("Error in delete Notifications controller",error.message);
        res.status(500).json({error:"Internal server error"})
        
    }
}


export const deleteNotiofication = async()=>{
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;
        const notification = await Notification.findById(notificationId)

        if(!notification){
            return res.status(404).json({error:"notification not found"})
        }


 if(notification.to.toString() !== userId.toString()){
    return res.status(403).json({error:"you are not authorized to delete this notification"})
        }

await Notification.findByIdAndDelete(notificationId)

res.status(200).json({message:"notification deleted successfully"});


    } catch (error) {
        console.log("Error in delete Notification controller",error.message);
        res.status(500).json({error:"Internal server error"})
        
    }
}
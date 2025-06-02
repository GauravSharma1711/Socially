
import User from "../models/user.model.js";

import { v2 as cloudinary } from "cloudinary";

export const getProfile = async (req,res)=>{
    try {
        
        const {username} = req.params;

       const user = await User.find({username}).select("-password")

       if(!user){
        return res.status(404).json({error:"User with this username does not exist "});
       }
       
res.status(200).json(user)


    } catch (error) {
          console.log("error in getProfile controller",error.message);
    return  res.status(500).json({error:"Internal server error"})
    }
}

export const suggestedUsers = async (req,res)=>{
    try {
        const userId = req.user._id;

      const usersFollowedByMe = await User.findById(userId).select("following")

      const users = await User.aggregate([
          {
            $match:{
                _id:{$ne:userId}
            }
          },
          {$sample:{size:10}}
      ])

      const filteredUsers =  users.filter(user=>!usersFollowedByMe.following.includes(user._id));

      const suggestedUsers = filteredUsers.slice(0,4)

      suggestedUsers.forEach(user=>user.password=null)

      res.status(200).json(suggestedUsers);

    } catch (error) {
          console.log("error in update suggestedUser controller",error.message);
    return  res.status(500).json({error:"Internal server error"})
    }
}


export const followUnfollowUser = async (req, res) => {
	try {
		const userId = req.params.id;       
		const myId = req.user._id;        

		
		const currentUser = await User.findById(myId);
		const userToModify = await User.findById(userId);

		
		if (!userToModify) {
			return res.status(404).json({ error: "User to follow/unfollow does not exist" });
		}

		
		if (userId === myId.toString()) {
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
		}

		
		const isFollowing = currentUser.following.includes(userId);

		if (isFollowing) {
			
			await User.findOneAndUpdate(
				{ _id: myId },
				{ $pull: { following: userId } }
			);
			await User.findOneAndUpdate(
				{ _id: userId },
				{ $pull: { followers: myId } }
			);

			return res.status(200).json({ message: "Unfollowed user successfully" });

		} else {
			
			await User.findOneAndUpdate(
				{ _id: myId },
				{ $push: { following: userId } }
			);
			await User.findOneAndUpdate(
				{ _id: userId },
				{ $push: { followers: myId } }
			);

			
			const newNotification = new Notification({
				from: myId,
				to: userId,
				type: "follow",
			});
			await newNotification.dispatchEvent();

			return res.status(200).json({ message: "Followed user successfully" });
		}

	} catch (error) {
		console.error("Error in followUnfollowUser controller:", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
};



export const updateProfile = async (req,res)=>{
try {
    
    	const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
	let { profileImg, coverImg } = req.body;

	const userId = req.user._id;


    let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

			user.password = await bcrypt.hash(newPassword, 10);
		}

    if (profileImg) {
			if (user.profileImg) {
				
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		
		user.password = null;

		return res.status(200).json(user);

} catch (error) {
    console.log("error in update profile controller",error.message);
    return  res.status(500).json({error:"Internal server error"})
    
}
}

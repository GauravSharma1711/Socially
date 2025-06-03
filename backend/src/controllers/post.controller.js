import User from "../models/user.model.js";
import Post from '../models/post.model.js'
import  {v2 as cloudinary } from 'cloudinary'
import Notification from '../models/notification.model.js'

export const getAllPosts = async(req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt:-1}).populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        })
        if(posts.length===0){
            return res.status(200).json([])
        }

        res.status(200).json(posts)

    } catch (error) {
         console.log("error in get all post controller");
    res.status(500).json({error:"Internal server error"})
    }
}


export const getFollowingPosts = async(req,res)=>{

    try {

        const userId =  req.user._id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({error:"user not found"})
        }

        const following = user.following

        const feedPosts = await Post.find({user:{$in:following}})
        .sort({createdAt:-1})
        .populate({
path:"user",
select:"-password"
        })
          .populate({
         path:"comments.user",
         select:"-password"
        })

        res.status(200).json(feedPosts)

    } catch (error) {
         console.log("error in get following post controller");
    res.status(500).json({error:"Internal server error"})
    }
}


export const getUserPosts = async(req,res)=>{

    try {
        const {username} = req.params;
        const user = await User.findOne({username})

        if(!user){
            return res.status(404).json({error:"user not found"})
        }

        const posts = await Post.find({user:user._id})
 .populate({
path:"user",
select:"-password"
        })
          .populate({
         path:"comments.user",
         select:"-password"
        })


        res.status(200).json(posts)
    } catch (error) {
          console.log("error in get User post controller");
    res.status(500).json({error:"Internal server error"})
    }

}


 

export const getLikedPosts = async(req,res)=>{
    try {
        const userId = req.params.id
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"usern not found"})
        }

        const likedPosts = await Post.find({_id: {$in:user.likedPosts}})
        .populate({
            path:"user",
            select:"-password"
        })
       .populate({
            path:"comments",
            select:"-password"
        })

        res.status(200).json(likedPosts)
        
    } catch (error) {
         console.log("error in getliked post controller");
    res.status(500).json({error:"Internal server error"})
    }
}




export const createPost = async (req, res) => {
  try {
    let { text, img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!text && !img)
      return res.status(400).json({ error: "Post must have text or image" });

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }

    const newPost = new Post({ user: userId, text, img });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log("error in create post controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const likeUnlikePost = async(req,res)=>{

    try {

        const postId = req.params.id
        const myId  = req.user._id

        const post = await  Post.findById(postId);

        if(post.likes.includes(myId)){
            //unlike post
          await Post.updateOne({_id:postId},{$pull:{likes:myId}})
          await User.updateOne({_id:myId},{$pull:{likedPosts:postId}})


          


res.status(200).json({message:"post unliked successfully"})
         }else{
            // likepost 
            post.likes.push(myId)
            await User.updateOne({_id:myId},{$push:{likedPosts:postId}})
            await post.save();
            res.status(200).json({message:"post liked successfully"})

            const notification = new Notification({
                from:myId,
                to:post.user,
                type:"like",
            })
            await notification.save();
        }

        

    } catch (error) {
           console.log("error in like/unlike post controller",error.message);
        return res.status(500).json({error:"Internal server error"})
    }
}



export const commentOnPost = async(req,res)=>{

    try {
        const postId = req.params.id;
        const myId = req.user._id;
        const {text} = req.body

        if(!text){
            return res.status(400).json({error:"text is required"});
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error:"Post not found"});
        }
        
        const comment  = {user:myId,text};
        post.comments.push(comment);

          await post.save(); 

        res.status(200).json(comment);

    } catch (error) {
         console.log("error in comment post controller",error.message);
        return res.status(500).json({error:"Internal server error"})
    }

}


export const deletePost = async(req,res)=>{

    try {
        const postId = req.params.id;
  const post = await Post.findById(postId);
if (!post) return res.status(404).json({ error: "Post not found" });

if (post.user.toString() !== req.user._id.toString()) {
  return res.status(401).json({ error: "Unauthorized" });
}

if (post.image) {
  const imgId = post.image.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(imgId);
}

await Post.findByIdAndDelete(postId);
res.status(200).json({ message: "Post deleted successfully" });


    } catch (error) {
        console.log("error in delete post controller",error.message);
        return res.status(500).json({error:"Internal server error"})
        
    }

}
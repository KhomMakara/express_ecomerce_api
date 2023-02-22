const asyncHandler = require('express-async-handler');
const Blog = require('../model/blogModel');
const cloudinaryUploadImg = require('../unils/cloudinary');

const createBlog = asyncHandler (async (req,res) => {
    try{
        const blog = await Blog.create(req.body);
        res.json(blog);
    }
    catch(error){
        throw new Error(error);
    }
});

//getblock
const getBlock = asyncHandler (async(req,res)  => {
    try{
        const {id} = req.params;
        const blog = await Blog.findById(id).populate("likes");
        await Blog.findByIdAndUpdate(id,
            {
                $inc: {numViews: 1}, //$inc user for counter number
            },
            {
                new:true,
            })
        res.json(blog);
    }
    catch(error){
        throw new Error(error);
    }
});

//update-blog

const updateBlog = asyncHandler (async (req,res) => {
    try{
        const {id} = req.params;
        const blog = await Blog.findByIdAndUpdate(id, req.body,{
            new: true
        });
        res.json(blog);
    }
    catch(error){
        throw new Error(error);
    }
});

//get-all-block
const getAllBlog = asyncHandler (async (req,res) => {
    try{
        const blog =await Blog.find();
        res.json(blog);
    }
    catch(error){
        throw new Error(error);
    }
});

//detele-blog
const deleteBlog = asyncHandler (async (req,res) => {
    try{
        const {id} = req.params;
        const blog =await Blog.findByIdAndDelete(id);
        res.json({
            message: 'Delete Sucess',
            blog
        });
    }
    catch(error){
        throw new Error(error);
    }
});

//like-blog
const likeBlog = asyncHandler (async (req,res) => {
    const {blogId} = req.body;
    
    //find the blog
    const blog = await Blog.findById(blogId);
    //find curren login user
    const loginUser =req?.user?._id;
  

    //find if user has dislikes the blog
    const alreadyDisliked = blog?.dislikes.find(
        (userId) => userId?.toString() === loginUser?.toString()
        
    );
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: {dislikes: loginUser},
                isDisliked: false,
            },
            {
                new:true,
            });
            res.json(blog);
    }

    if(blog?.isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: {likes: loginUser},
                isLiked:false,
                
            },
            {
                new:true,
            })
            res.json(blog);
    }
    else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: {likes: loginUser},
                isLiked: true,
            },
            {
                new:true,
            }
        );
        res.json(blog);
    }
});


const dislikeBlog = asyncHandler (async (req,res) => {
    const {blogId} = req.body;
   
    //find the blog
    const blog = await Blog.findById(blogId);
    const loginUser =req?.user?._id;

    //check if block is already like
    const alreadylike = blog?.likes?.find((userId) => userId?.toString() ===loginUser.toString());
  
    if(alreadylike){
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: {likes: loginUser},
                isLiked:false,
            },
            {
                new:true,
            });
            res.json(blog);
    }

    if(blog?.isDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: {dislikes: loginUser},
                isDisliked:false,
            },
            {
                new:true,
            });
            res.json(blog);
    }
    else{
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push: {dislikes: loginUser},
            isDisliked:true,
        },
        {
            new:true,
        });
        res.json(blog);
    }
   
});


//upload Image
const uplaodImages = asyncHandler (async (req,res) => {
    
    try{
        const {id} = req.params;
      const uploader = (path) => cloudinaryUploadImg(path, "images");
      const urls = [];
      const files = req.files;
      for(const file of files){
        const {path} = file;
        const newpath = await uploader(path);
        urls.push(newpath);
       
      }
      const blog = await Blog.findByIdAndUpdate(
        id,
        {
          images: urls.map((file) => {
            return file;
          },
          {
            new:true,
          }
          )
        }
      );
      res.json(blog);
    }
    catch(error){
      throw new Error(error);
    }
  });

module.exports = {
    createBlog,
    getBlock,
    updateBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uplaodImages,
}
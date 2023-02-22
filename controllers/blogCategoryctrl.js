const asyncHandler = require('express-async-handler');
const Category = require('../model/blogCateModel');

const createBlogCategory = asyncHandler (async (req,res)  => {
    try{
        const category = await Category.create(req.body);
        res.json(category);
    }
    catch(error){
        throw new Error(error);
    }
});

const getAllBlogCategory = asyncHandler (async (req,res) => {
    try{
        const category = await Category.find();
        res.json(category);
    }
    catch(error){
        throw new Error(error);
    }
});

const updateBlogCategory = asyncHandler (async (req,res) => {
    try{
        const {id} = req.params;
        const category = await Category.findByIdAndUpdate(id,req.body);
        res.json(category);
    }
    catch(error){
        throw new Error(error);
    }
});

const deleteBlogCategory = asyncHandler (async(req,res) => {
    try{
        const {id} = req.params;
        const category =await Category.findByIdAndDelete(id);
        res.json({
            message: 'delete success!',
            category
        });
    }
    catch(error){
        throw new Error(error);
    }
});

const getBlogCategoryById = asyncHandler (async(req,res) => {
    try{
        const {id} = req.params;
        const category = await Category.findById(id);
        res.json(category);
    }
    catch(error){
        throw new Error(error);
    }
});
    

module.exports = {
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    getAllBlogCategory,
    getBlogCategoryById,
}

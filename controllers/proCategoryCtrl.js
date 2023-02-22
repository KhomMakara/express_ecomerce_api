const asyncHandler = require('express-async-handler');
const Category = require('../model/proCateModel');

const createProCategory = asyncHandler (async (req,res)  => {
    try{
        const ProCategory = await Category.create(req.body);
        res.json(ProCategory);
    }
    catch(error){
        throw new Error(error);
    }
});

const getAllProCategory = asyncHandler (async (req,res) => {
    try{
        const category = await Category.find();
        res.json(category);
    }
    catch(error){
        throw new Error(error);
    }
});

const updateProCategory = asyncHandler (async (req,res) => {
    try{
        const {id} = req.params;
        const category = await Category.findByIdAndUpdate(id,req.body);
        res.json(category);
    }
    catch(error){
        throw new Error(error);
    }
});

const deleteProCategory = asyncHandler (async(req,res) => {
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

const getProCategoryById = asyncHandler (async(req,res) => {
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
    createProCategory,
    getAllProCategory,
    updateProCategory,
    deleteProCategory,
    getProCategoryById,
}

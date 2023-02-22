const asyncHandler = require('express-async-handler');
const Coupon = require('../model/couponModel');

const createCoupon = asyncHandler (async(req,res) => {
    try{
        const coupon = await Coupon.create(req.body);
        res.json(coupon);
    }
    catch(error){
        throw new Error(error);
    }
});

const getAllCoupon = asyncHandler (async (req,res) => {
    try{
        const coupon = await Coupon.find();
        res.json(coupon);
    }
    catch(error){
        throw new Error(error);
    }
});

const updateCoupon = asyncHandler (async (req,res) => {
    try{
        const {id} = req.params;
        const coupon = await Coupon.findByIdAndUpdate(id,req.body);
        res.json(coupon);
    }
    catch(error){
        throw new Error(error);
    }
});

const deleteCoupon = asyncHandler (async (req,res) => {
    try{
        const {id} = req.params;
        const coupon =await Coupon.findByIdAndDelete(id);
        res.json(coupon);
    }
    catch(error){
        throw new Error(error);
    }
});

module.exports = {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon,
}
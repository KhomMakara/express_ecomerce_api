const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const generateToken = require('../config/jwt');
const generateRefreshToken = require('../config/jwtRefresh.js');
const { sendEmail } = require('./emailCrtl');
const Cart = require('../model/cartModel');
const Product = require('../model/productModel');
const Coupon = require('../model/couponModel');
const Order = require('../model/orderModel');
const unique = require('uniqid');
const createUser = asyncHandler( async (req,res) => {
    const {firstname,lastname,mobile,email,password} = req.body;
    const findUser = await User.findOne({email:email});
    if(!findUser){
        const newUser = new User({
            firstname,
            lastname,
            mobile,
            email,
            password
        })
        try{
           await newUser.save();
            return res.json(newUser);
        }
        catch(error){
            res.json(error.message);
        }
       
    }
    else{
       throw new Error("User Aleady Exist")
    }
});


const login = asyncHandler(async (req,res)  => {
    const {email,password} = req.body;
    const findUser = await User.findOne({email});
    if(findUser && ( await findUser.isPasswordMatch(password))){
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateUser = await User.findByIdAndUpdate(findUser?.id,{
            refreshToken:refreshToken,
        },
        {
            new: true
        });
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            role: findUser?.role,
            token: generateToken(findUser?._id)
        });
    }
    else{
        throw new Error("Invalid Credent");
    }
});

const getAllUser = asyncHandler ( async (req,res) => {
    try{
        const user = await User.find().populate('wishlist');
        res.json(user);
    }
    catch(error){
        throw new Error(error);
    }
});
const getaUser = asyncHandler (async (req,res)  => {
    try{
        const {id} = req.params;
        const user =await User.findById(id).populate("cart");
        res.json(user);
    }
    catch(error){
        throw new Error(error);
    }
});
const deleteAUser = asyncHandler ( async (req,res) => {
    try{
        const {id} = req.params;
        const user =await User.findByIdAndDelete(id);
        res.json({
            status: true,
            message: "delete Success",
            data: user
        })
    }
    catch(error){
        throw new Error(error);
    }
});

const updateUser = asyncHandler (async(req,res)  => {
   try{
    const {_id} = req.user;
    const user = await User.findByIdAndUpdate(
        _id,
        {
            firstname: req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile: req?.body?.mobile
        },
        {
            new: true
        }
    );
    res.json(user);
   }
   catch(error){
    throw new Error(error);
   }
});

const blockUser = asyncHandler (async (req,res)  => {
    try{
        const {id} = req.params;
          const block = await User.findByIdAndUpdate(
        id,
        {
         isBlock: true,
        },
        {
            new: true
        }
    )
    res.json({message: "User Blocked"});
    }
    catch(error){
        throw new Error(error);
    }
});

const unblockUser = asyncHandler (async (req,res)  => {
   try{
    const {id} = req.params;
    const unblock = await User.findByIdAndUpdate(id,
        {
            isBlock:false,
        },
        {
            new: true
        })
        res.json({message: "User is Unblocked"});
   }
   catch(error){
    throw new Error(error);
   }
});

const handlerRefreshToken = asyncHandler (async (req,res)  => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    // console.log(user);
    if(!user) throw new Error("No Refresh Token Present in DB or not Matched");
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=> {
        if(err || user.id !== decoded.id){
            throw new Error("Somthing is wrong with refresh token");
        }

        const accessToken = generateRefreshToken(user?.id);
        res.json({accessToken});
    });
});

const logout = asyncHandler (async (req,res)  => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh token in Cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true
        });
        return res.sendStatus(204);
    }

    //update resfreshToken
    const updateUser = await User.findOneAndUpdate(refreshToken,{
        refreshToken: "",
    });

   
});
const updatePassword = asyncHandler (async (req,res)  => {
    const {_id} = req.user;
    const {password} = req.body;
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    }
    else{
        res.json(user);
    }
});

//forgot password
const forgotPassword = asyncHandler (async (req,res)  => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) throw new Error("User Not Found with this Email!");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this Link to reset your password. This link is valid till
        10minuts from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html:resetURL,
        };
         sendEmail(data);
        res.json(token);
        
    }
    catch(error){
        throw new Error(error);
    }
});

//reset password
 const resetPassword = asyncHandler (async (req,res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hasheToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hasheToken,
        passwordResetExprires: {$gt: Date.now()},
    });
    if(!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExprires = undefined;
    await user.save();
    res.json(user);
 });

 const getWishlist = asyncHandler (async (req,res) => {
    const {_id} = req.user;
    try{
        const user = await User.findById(_id).populate('wishlist');
        res.json(user);
    }
     catch(error){
        throw new Error(error);
     }
 });

 const saveAddress = asyncHandler (async(req,res) => {
    const {_id} = req.user;
    try{
        const user = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address
            },
            {
                new:true,
            }
           
        );
        res.json(user);
    }
    catch(error){
        throw new Error(error);
    }
 });

 const userCart = asyncHandler (async (req,res) => {
    const {_id} = req.user;
    const {cart} = req.body;
   try{
    let products = [];
    const user = await User.findOne({_id});
    const alreadyExise = await Cart.findOne({orderby:user._id});
    if(alreadyExise){
        alreadyExise.remove();
    }
    for(let i =0 ;i< cart.length ;i++){
        let object = {};
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        let getPrice = await Product.findById(cart[i]._id).select("price").exec();
        object.price = getPrice.price;
        products.push(object);
    }
    let cartTotal =0;
    for(let i =0 ;i<products.length ;i++){
         cartTotal += products[i].price * products[i].count;
    }
    let newcart = await new Cart({
        products,
        cartTotal,
        orderby:user?._id
    }).save();
    res.json(newcart);
    
   
   }
   catch(error){
    throw new Error(error);
   }
 });

 const getAllCart = asyncHandler (async (req,res)  => {
    const {_id} = req.user;
    try{
        const cart =await Cart.findOne({orderby:_id}).populate("products.product");
        res.json(cart);
    }
    catch(error){
        throw new Error(error);
    }
 });

 const emptyCart = asyncHandler (async (req,res) => {
    const {_id} = req.user;
    try{
        const user = await User.findOne({_id});
        const cart = await Cart.findOneAndRemove({orderby:user._id});
        res.json(cart);
    }
    catch(error){
        throw new Error(error);
    }
 });


 //apply coupon
 const applyCoupon = asyncHandler (async (req,res) => {
    const {coupon} = req.body;
    const {_id} = req.user;
    try{
        const validCoupon = await Coupon.findOne({name:coupon});
        if(validCoupon === null){
            throw new Error("Coupon not valid!");
        }
        const user = await User.findOne({_id});
        const {cartTotal} = await Cart.findOne({orderby:user._id}).populate("products.product");
        let totalAfterDiscount = (cartTotal * (validCoupon.discount / 100)).toFixed(2);

        await Cart.findOneAndUpdate(
            {orderby: user._id},
            {totalAfterDiscount },
            {new: true}
        );
        res.json(totalAfterDiscount);
    }
    catch(error){
        throw new Error(error);
    }
 });

 //order
 const order = asyncHandler (async(req,res) => {
    const {COD,couponapplied} = req.body;
    const {_id} = req.user;
    try{
        if(!COD) throw new Error("Create Cash order fails!");
        const user = await User.findOne({_id});
        const userCart = await Cart.findOne({orderby: user._id});
        let finalTotal = 0;
        if(couponapplied && userCart){
            finalTotal = userCart.totalAfterDiscount * 100;
        }
        else{
            finalTotal = userCart.cartTotal * 100;
        }

       let newOrder = new Order({
        products: userCart.products,
        paymentIntent: {
            id: unique(),
            method: "COD",
            amount: finalTotal,
            status: "Cash on Delivery",
            created: Date.now(),
            currency: "usd",
        },
        orderby:user._id,
        orderStatus: "Cash on Delivery",

       }).save();

       let update = userCart.products.map((item) => {
        return {
            updateOne: {
                filter: {_id: item.product._id},
                update: {$inc: {quantity: -item.count,sold: item.count}}
            }
        }
       });

       const updated = await Product.bulkWrite(update,{});
       res.json({message: "success"});
    }
    catch(error){
        throw new Error(error);
    }
 });

 const getOrder = asyncHandler (async(req,res) => {
    const {_id} = req.user;
    try{
        const user = await User.findOne({_id});
        const order = await Order.findOne({orderby:user._id}).populate("products.product");
        res.json(order);
    }
    catch(error){
        throw new Error(error);
    }
 });

 const updateOrderStatus = asyncHandler (async (req,res)  => {
    const {status} = req.body;
    const {id} = req.params;
    try{
        const order = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus:status,
                paymentIntent:{
                    status: status,
                },
            },

        );
        res.json(order);
    }
    catch(error){
        throw new Error(error);
    }
 })
module.exports = {
    createUser,
    login,
    getAllUser,
    getaUser,
    deleteAUser,
    updateUser,
    blockUser,
    unblockUser,
    handlerRefreshToken,
    logout,
    updatePassword,
    forgotPassword,
    resetPassword,
    getWishlist,
    saveAddress,
    userCart,
    getAllCart,
    emptyCart,
    applyCoupon,
    order,
    getOrder,
    updateOrderStatus,
}
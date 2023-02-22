const express = require('express');
const { createUser, login, getAllUser, getaUser, deleteAUser, updateUser, blockUser, unblockUser, handlerRefreshToken, logout, updatePassword, forgotPassword, resetPassword, getWishlist, saveAddress, userCart, getAllCart, emptyCart, applyCoupon, order, getOrder, updateOrderStatus } = require('../controllers/userCtrl');
const {authMiddleware,isAdmin} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register',createUser);
router.post('/login',login)
router.get('/all-user',authMiddleware,getAllUser);
router.get('/single-user/:id',authMiddleware,getaUser);
router.delete('/delete-user/:id',authMiddleware,isAdmin,deleteAUser);
router.put('/update-user',authMiddleware,isAdmin,updateUser);
router.get('/wishlist',authMiddleware,getWishlist);
router.put('/block-user/:id',authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);
router.get('/refresh',handlerRefreshToken);
router.get('/logout',logout);
router.post('/update-password',authMiddleware,updatePassword);
router.post('/forgot-password-token',authMiddleware,forgotPassword);
router.put('/reset-password/:token',resetPassword)
router.put('/save-address',authMiddleware,saveAddress);
router.post('/cart',authMiddleware,userCart);
router.get('/all-cart',authMiddleware,getAllCart);

router.delete('/empty-cart',authMiddleware,emptyCart);
router.post('/apply-coupon',authMiddleware,applyCoupon);
router.post('/order',authMiddleware,order);
router.get('/order',authMiddleware,getOrder);
router.put('/update-status/:id',authMiddleware,updateOrderStatus);


module.exports = router;
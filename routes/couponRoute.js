const express = require('express');
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponCtrl');
const { isAdmin, authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/',authMiddleware,createCoupon);
router.get('',authMiddleware,getAllCoupon);
router.put('/:id',authMiddleware,updateCoupon);
router.delete('/:id',authMiddleware,deleteCoupon);

module.exports = router;
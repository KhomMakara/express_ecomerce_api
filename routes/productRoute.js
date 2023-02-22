const express = require('express');
const { createProduct, getaProduct,
     allProduct, updateProduct, 
     deleteProduct, addtoWishlist,
      rating, uplaodImage 
    } = require('../controllers/productCtrl');
const router = express.Router();
const {isAdmin,authMiddleware} = require('../middleware/authMiddleware');
const { productImgResize, uploadPhoto } = require('../middleware/uploadImg');

router.post('/create-product',createProduct);
router.get('/:id',authMiddleware,isAdmin,getaProduct);
router.get('/',authMiddleware,isAdmin,allProduct);
router.put('/:id',authMiddleware,isAdmin,updateProduct);
router.put('/upload/:id',authMiddleware,uploadPhoto.array("image",10),productImgResize,uplaodImage);
router.delete('/:id',authMiddleware,isAdmin,deleteProduct);
router.patch('/wishlist',authMiddleware,addtoWishlist);
router.patch('/rating',authMiddleware,rating);

module.exports = router;
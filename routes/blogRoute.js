const express = require('express');
const { createBlog, getBlock, updateBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog, uplaodImages } = require('../controllers/blogCtrl');
const { uplaodImage } = require('../controllers/productCtrl');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { uploadPhoto, blogImgResize } = require('../middleware/uploadImg');

const router= express.Router();

router.post('/',authMiddleware,isAdmin,createBlog);
router.get('/:id',getBlock);
router.put('/:id',authMiddleware,isAdmin,updateBlog);
router.get('/',authMiddleware,isAdmin,getAllBlog);
router.put('/upload/:id',authMiddleware,uploadPhoto.array("image",10),blogImgResize,uplaodImages);
router.delete('/:id',authMiddleware,isAdmin,deleteBlog);
router.patch('/like',authMiddleware,likeBlog);
router.patch('/dislike',authMiddleware,dislikeBlog);

// router.put('/upload/:id',authMiddleware,uploadPhoto.array("image",10),productImgResize,uplaodImage);


module.exports = router;
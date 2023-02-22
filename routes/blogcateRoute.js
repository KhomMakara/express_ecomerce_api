const express = require('express');
const { createblogCategory, getAllBlogCategory, updateBlogCategory, deleteBlogCategory, getBlogCategoryById, createBlogCategory } = require('../controllers/blogCategoryctrl');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/',authMiddleware,createBlogCategory);
router.get('/',authMiddleware,getAllBlogCategory);
router.put('/:id',authMiddleware,updateBlogCategory);
router.delete('/:id',authMiddleware,deleteBlogCategory);
router.get('/:id',authMiddleware,getBlogCategoryById);

module.exports = router;
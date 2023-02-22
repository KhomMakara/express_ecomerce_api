const express = require('express');
const { createProCategory, getAllProCategory, updateProCategory, deleteProCategory, getProCategoryById } = require('../controllers/proCategoryCtrl');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,createProCategory);
router.get('/',authMiddleware,getAllProCategory);
router.put('/:id',authMiddleware,updateProCategory);
router.delete('/:id',authMiddleware,deleteProCategory);
router.get('/:id',authMiddleware,getProCategoryById);

module.exports = router;
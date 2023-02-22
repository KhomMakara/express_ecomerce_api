const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const slugify = require("slugify");
const cloudinaryUploadImg = require("../unils/cloudinary");
const fs = require('fs');

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const allProduct = asyncHandler(async (req, res) => {
  try {
    //filtering
    const queryObj = { ...req.query };
    const excludeField = ["page", "sort", "limit", "fields"];
    excludeField.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limit field
    if (req.query.fields) {
      const field = req.query.fields.split(",").join(" ");
      query = query.select(field);
    } else {
      query = query.select("-__v");
    }

    //paginate
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    // console.log(page,limit,skip);
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
      const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json({
        message: "Product update Success",
        updateProduct,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json({
      message: "Product Delete Success",
      deleteProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//addtoWishlist
const addtoWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { proId } = req.body;
  const user = await User.findById(_id);
  //check if product already addto wishlist
  const alreadyAdd = user.wishlist.find(
    (id) => id.toString() === proId.toString()
  );
  if (alreadyAdd) {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $pull: { wishlist: proId },
      },
      {
        new: true,
      }
    );

    res.json(user);
  } else {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $push: { wishlist: proId },
      },
      {
        new: true,
      }
    );
    res.json({
      message: "wishlist add success!",
      user,
    });
  }
});

//rating star
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId,comment } = req.body;
  const product = await Product.findById(prodId);
  let alreadyRate = product.ratings.find(
    (userId) => userId.postedby.toString() === _id.toString()
  );
  try{
    if (alreadyRate) {
        const updateRated = await Product.findByIdAndUpdate(
        prodId,
        {
          ratings:{
            stars: star
          }
        },
        
          // {
            
          //   ratings: {$eleMatch: alreadyRate},
          // },
          // {
          //   $set: { "ratings.$.star": star },
          // },
          {
            new: true,
          }
        );
        res.json(updateRated);
      } else {
        const product = await Product.findByIdAndUpdate(
          prodId,
          {
            $push: {
              ratings: {
                stars: star,
                comment:comment,
                postedby: _id,
              },
            },
          },
          {
            new: true,
          }
        );
    
        res.json(product);
      }

      const getAllTotalrating = await Product.findById(prodId);
      let totalRating = getAllTotalrating.ratings.length;
      let ratingSum = getAllTotalrating.ratings
      .map((item) => item.stars)
      .reduce((prev,curr) => prev + curr , 0);
      let actualRating = Math.round(ratingSum / totalRating);
      let finalProduct = await Product.findByIdAndUpdate(
      prodId,
        {
          totalratings: actualRating,
        },
        {
          new:true,
        }
      );
      res.json(finalProduct);
  }
  catch(error){
    throw new Error(error);
  }

  
});

//upload Image
const uplaodImage = asyncHandler (async (req,res) => {
  const {id} = req.params;
  try{
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for(const file of files){
      const {path} = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
      
    }

    const findproduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        },
        {
          new:true,
        }
        )
      }
    );

    res.json(findproduct);
   
  }
  catch(error){
    throw new Error(error);
  }
})

module.exports = {
  createProduct,
  getaProduct,
  allProduct,
  updateProduct,
  deleteProduct,
  addtoWishlist,
  rating,
  uplaodImage,
};

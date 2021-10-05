// const path = require('path');
const fs = require("fs");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Product = require("../models/product");
const sequelize = require("../utils/database");

exports.getProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const { title, description, category, price } = req.body;
  const product = await Product.create({
    title: title,
    description: description,
    category: category,
    price: price,
  });
  res.status(201).json({
    success: true,
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  await Product.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  let columnsToUpdate = Object.keys(req.body);
  for (val of columnsToUpdate) {
    product[val] = req.body[val];
  }
  // test save
  await product.save();

  // product = await Product.findByPk(req.params.id);

  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.productMainPhotoUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 401)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.main;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an imagine file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${product.id}_main_${file.name}`;

  // remove old main photo if existing
  if (product.main_img) {
    const oldPhoto = product.main_img;
    let deletePath = `${process.env.FILE_UPLOAD_PATH}/${oldPhoto}`;
    fs.unlinkSync(deletePath);
  }

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    product.main_img = file.name;
    await product.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

exports.productSecondaryPhotosUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 401)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  let photos = Object.keys(req.files);

  // remove old product photos if existing
  if (product.product_imgs) {
    let oldPhotos = Object.values(product.product_imgs);
    console.log(oldPhotos);
    for (oldPhoto of oldPhotos) {
      let deletePath = `${process.env.FILE_UPLOAD_PATH}/${oldPhoto}`;
      fs.unlinkSync(deletePath);
    }
    await product.update({ product_imgs: [] });
  }

  for (photoKeys of photos) {
    let photo = req.files[photoKeys];
    // Make sure the image is a photo
    if (!photo.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an imagine file`, 400));
    }

    // Check filesize
    if (photo.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    // Create custom filename
    photo.name = `photo_${product.id}_product_${photo.name}`;

    photo.mv(`${process.env.FILE_UPLOAD_PATH}/${photo.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file(s) upload`, 500));
      }
      await product.update({
        product_imgs: sequelize.fn(
          "array_append",
          sequelize.col("product_imgs"),
          photo.name
        ),
      });
    });
  }

  res.status(200).json({
    success: true,
  });
});

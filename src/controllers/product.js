const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const Product = require("../model/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.status(200).json({
        message: "Fetched products successfully.",
        products: products,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};

exports.postCredentials = (req, res, next) => {
  const { email, password } = req.body;
  // verify details with credential stored in database
  if (email === "poise@gmail.com" && password === "rexxiepoise") {
    res.status(200).json({
      message: "Login successful",
    });
  } else {
    res.status(401).json({
      message: "Invalid credentials",
    });
  }
};

exports.postProduct = (req, res, next) => {
  // destructure the body object
  // const { title, description, price, details, image } = req.body;
  const result = validationResult(req);
  // check if the above details is present in the body
  if (result.isEmpty()) {
    const { title, description, price, details, image } = req.body;
    // creating a new instance of the Product and passing the request body
    const product = new Product({
      title,
      description,
      price,
      details,
      image,
      creator: { name: "Poise Admin" },
    });

    // saving the product
    product
      .save()
      .then(response => {
        console.log(response);
        res.status(201).json({
          message: "Product added successfully",
          post: response,
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        /*send err to the next middleware handling error message*/
        next(err);
      });
  } else {
    // res.status(422).json({ message: result.array() });
    /*general error handling technique*/
    const error = new Error("Validation failed, entered data is incorrect");
    /*adding custom property statusCode to the new error instance*/
    error.statusCode = 422;
    throw error;
  }
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error("Product not found");
        // set not found error
        error.statusCode = 404;
        /*the error thrown will find it's way into the catch block*/
        throw error;
      }
      res
        .status(200)
        .json({ message: "Product fetched successfully", product: product });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postImage = (req, res, next) => {
  // console.log(req.file);
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  // configuration

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Upload;

  const result = cloudinary.uploader.upload(req.file.path, {
    public_id: req.file.originalname,
  });
  // how transform the image uploaded to cloudinary
  result
    .then(data => {
      // console.log(data);
      // console.log(data.secure_url);

      res.status(200).json({
        message: "image upload to cloudinary successful",
        url: data.secure_url,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
        res
          .status(err.statusCode)
          .json({ error: "Failed to upload image to cloudinary" });
        next(err);
      }
    });
};
exports.updateProduct = (req, res, next) => {
  const productId = req.params.productId;
  console.log(req.params);
  console.log(req.body.title);
  console.log(productId);
  const valError = validationResult(req);
  if (!valError.isEmpty()) {
    const error = new Error("Error validating input, kindly check your input");
    error.statusCode = 422;
    throw error;
  }

  const { title, description, price, details, image } = req.body;
  if (!image) {
    const error = new Error("No image uploaded");
    error.statusCode = 422;
    throw error;
  }

  Product.findById(productId)
    .then(product => {
      if (!product) {
        const error = new Error(`Product with id:${productId} not found`);
        error.statusCode = 404;
        throw error;
      }
      product.title = title;
      product.description = description;
      product.price = price;
      product.details = details;
      product.image = image;

      return product.save();
    })
    .then(result => {
      res
        .status(200)
        .json({ message: "Product updated successfully", product: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};

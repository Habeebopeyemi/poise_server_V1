const { validationResult } = require("express-validator");
const Product = require("../model/product");

exports.getProducts = (req, res, next) => {
  res.status(200).json({
    products: [],
  });
};

exports.getCredentials = (req, res, next) => {
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
        console.log(err);
      });
  } else {
    res.status(422).json({ message: result.array() });
  }
};

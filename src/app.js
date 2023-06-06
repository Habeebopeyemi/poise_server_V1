const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");
// multer for accepting formdata
const multer = require("multer");

const productRoutes = require("../src/routes/products");
const authRoutes = require("../src/routes/auth");

const app = express();

/*setup file storage to control where image is stored*/
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// handling filetype validation
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded())//x-www-form-urlencoded <form></form>
app.use(bodyParser.json()); //application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("file")
);

// handling CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,x-requested-with"
  );
  next();
});

// setting up differnt routes
app.use("/products", productRoutes);
app.use("/auth", authRoutes);

/*setting up general error handling middleware*/
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  /*error property exist by default*/
  const message = error.message;
  // reference to authController
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

/*establishing connection to the database*/
mongoose.connect(
  `${process.env.THISISPOISE_V1_DB}products?retryWrites=true&w=majority`
);
app.listen(8080);

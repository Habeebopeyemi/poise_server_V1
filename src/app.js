const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
// multer for accepting formdata
const multer = require("multer");

const productRoutes = require("../src/routes/products");

const app = express();
/*setup file storage to control where image is stored*/
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  }
};
// app.use(bodyParser.urlencoded())//x-www-form-urlencoded <form></form>
app.use(bodyParser.json()); //application/json
app.use(multer().single("file"));

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

app.use("/products", productRoutes);
/*setting up general error handling middleware*/
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  /*error property exist by default*/
  const message = error.message;
  res.status(status).json({ message: message });
});

/*establishing connection to the database*/
mongoose.connect(
  `${process.env.THISISPOISE_V1_DB}products?retryWrites=true&w=majority`
);
app.listen(8080);

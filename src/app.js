const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("../src/routes/products");

const app = express();

// app.use(bodyParser.urlencoded())//x-www-form-urlencoded <form></form>
app.use(bodyParser.json()); //application/json

// handling CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/products", productRoutes);

/*establishing connection to the database*/
mongoose.connect(
  `${process.env.THISISPOISE_V1_DB}products?retryWrites=true&w=majority`
);
app.listen(8080);

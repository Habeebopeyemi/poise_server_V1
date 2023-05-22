const express = require("express");
const productRoutes = require("../src/routes/products");
const bodyParser = require("body-parser")

const app = express();

// app.use(bodyParser.urlencoded())//x-www-form-urlencoded <form></form>
app.use(bodyParser.json()); //application/json

app.use("/products", productRoutes);

app.listen(8080);

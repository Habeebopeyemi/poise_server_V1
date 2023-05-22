const express = require("express");
const productController = require("../controllers/product");

const router = express.Router();
// GET "/products"
router.get("/", productController.getProducts);
router.post("/post", productController.postProduct);
router.post("/credentials", productController.getCredentials);

module.exports = router;

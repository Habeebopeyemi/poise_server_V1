const express = require("express");
const { body } = require("express-validator");
const productController = require("../controllers/product");

const router = express.Router();
// GET "/products"
router.get("/", productController.getProducts);
router.get("/product/:productId", productController.getProduct);
router.post("/image", productController.postImage);
router.delete("/product/:productId", productController.deleteProduct)
router.post(
  "/credentials",
  [body("email").trim().isEmail(), body("password").trim().notEmpty()],
  productController.postCredentials
);
/*validation*/
router.post(
  "/postproduct",
  [
    body("title").trim().isLength({ min: 5 }).escape(),
    body("description").trim().isLength({ min: 5 }).escape(),
    body("price").trim().isNumeric(),
    body("details").trim().isLength({ min: 5 }).escape(),
    body("image").trim().isURL(),
  ],
  productController.postProduct
);
router.put(
  "/product/:productId",
  [
    body("title").trim().isLength({ min: 5 }).escape(),
    body("description").trim().isLength({ min: 5 }).escape(),
    body("price").trim().isNumeric(),
    body("details").trim().isLength({ min: 5 }).escape(),
    body("image").trim().isURL(),
  ],
  productController.updateProduct
);
module.exports = router;

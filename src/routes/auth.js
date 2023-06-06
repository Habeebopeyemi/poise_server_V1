const express = require("express");
const { body } = require("express-validator");
const Admin = require("../model/admin");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Admin.findOne({ email: value }).then(adminDoc => {
          if (adminDoc) {
            return Promise.reject("E-Mail address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("adminname").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post("/login")

module.exports = router;

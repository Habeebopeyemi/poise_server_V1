const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const adminname = req.body.adminname;
  const password = req.body.password;

  // password protection with bycrypt hashing
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const admin = new Admin({
        email: email,
        password: hashedPw,
        adminname: adminname,
      });
      return admin.save();
    })
    .then(result => {
      res.status(201).json({ message: "Admin created!", adminId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedAdmin;
  Admin.findOne({ email: email })
    .then(reAdmin => {
      if (!reAdmin) {
        const error = new Error("This admin could not be found");
        error.statusCode = 401;
        throw error;
      }
      loadedAdmin = reAdmin;

      // password comparison with bycrypt compare
      return bcrypt.compare(password, reAdmin.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      // genrating a token signature with jwt
      const token = jwt.sign(
        {
          email: loadedAdmin.email,
          adminId: loadedAdmin._id.toString(),
        },
        "thisispoiseadminsecretkeepitsafe",
        { expiresIn: "1hr" }
      );

      res.status(200).json({
        meesage: "welcome back poise admin",
        token: token,
        adminId: loadedAdmin._id.toString(),
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

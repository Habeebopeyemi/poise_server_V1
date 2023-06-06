const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  adminname: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I am new!",
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);

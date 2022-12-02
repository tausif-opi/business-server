const mongoose = require('mongoose');
const { isEmail } = require('validator');

const adminSchema = new mongoose.Schema({
email: {
  type: String,
  required: [true, 'Please enter an email'],
  unique: true,
  lowercase: true,
  validate: [isEmail, 'Please enter a valid email']
},
password: {
  type: String,
  required: [true, 'Please enter a password'],
  minlength: [6, 'Minimum password length is 6 characters'],
},
title: {
  type: String,
  required: [true, "enter title"],
  minlength: [2, "minimum title length is 2 characters"]
},
profilePic: {
  type: String,

},
createdAt: {
  required: [true, "invalid createdAt date"],
  type: Date
},
updatedAt: {
  required: [true, "invalid updatedAt"],
  type: Date
}
});

const AdminModel = mongoose.model("admin", adminSchema, "admin");



module.exports = AdminModel;
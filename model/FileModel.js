const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({

title: {
  type: String,
  required: [true, "enter title"],
  minlength: [2, "minimum title length is 2 characters"]
},

sendTo:{
  type: [String],
  required: [true, "please enter customer id"],

},
createdAt: {
  required: [true, "invalid createdAt date"],
  type: Date
},
updatedAt: {
  required: [true, "invalid updatedAt date"],
  type: Date
}
});

const FileModel = mongoose.model("file", fileSchema, "file");



module.exports = FileModel;
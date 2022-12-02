const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({

title: {
  type: String,
  required: [true, "enter title"],
  minlength: [2, "minimum title length is 2 characters"]
},

fields:{
  type: [String],
  required: [true, "fields can not be empty"],

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

const ProjectModel = mongoose.model("project", projectSchema, "project");



module.exports = ProjectModel;
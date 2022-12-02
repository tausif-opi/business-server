const mongoose = require('mongoose');
const {Types} = mongoose

const projectDataSchema = new mongoose.Schema({

project: {
  type: Types.ObjectId,
  required: [true, "enter project"],
},

fields:{
  type: mongoose.Schema.Types.Mixed
},

publish: {
  type: Boolean,
  required: [true, "publish status must be given"]
},

title: {
  type :String,

},
category: {
  type: String,
  enum: ["land", "property"]
},
subtitle: {
  type: String

},

image: {
  type: [String]
},

price: {
  type: Number
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

const projectDataModel = mongoose.model("projectData", projectDataSchema, "projectData");



module.exports = projectDataModel;
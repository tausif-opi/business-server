const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({

name: {
  type: String,
  required: [true, "please enter name"],
},

phone: {
  type: String,
  required: [true, "please enter a number"]
},

email: {
  type: String,
},
address: {
  type: String,
},
whatsapp: {
  type: String,
  required: [true, "please enter a whatsapp number"],

},

workingPhone: {
  type: String,
},
profession: {
  type: String
},
designation: {
  type: String
},
organization: {
  type: String
},
source: {
  type: String,
},
project: {
  type: String
},

stage: {
  type: String,
  enum: ["lead", "prospect", "high prospect", "priority", "booked", "sold", "follow up", "initial", "reject"]
},

comments: {
  type: [String],
},

query:{
  type: [
    {
      project: String,
      fields:[],
      createdAt: Date,
      updatedAt: Date,
      message: String,
    }
  ],
},

source: {
  type: String,
  required: [true, "please enter customer source"]
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

const CustomerModel = mongoose.model("customer", customerSchema, "customer");



module.exports = CustomerModel;
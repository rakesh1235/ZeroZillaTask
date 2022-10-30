const mongoose = require("mongoose");
const { Schema } = mongoose;

const AgencySchema = new Schema({
  AgencyId: {
    type: Number,
    required: true,
    unique: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Address1: {
    type: String,
    required: true,
  },
  Address2: {
    type: String,
  },
  State: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  PhoneNumber: {
    type: Number,
    required: true,
  },
});

const Agency = mongoose.model("agency", AgencySchema);
Agency.createIndexes();
module.exports = Agency;

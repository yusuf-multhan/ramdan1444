const mongoose = require("mongoose");

const HofDetailsSchema = new mongoose.Schema({
  ITS_ID: {
    type: String,
    required: true,
  },
  HOF_FM_TYPE: {
    type: String,
    required: true,
  },
  HOF_ID: {
    type: String,
    required: true,
  },
  Full_Name: {
    type: String,
    required: true,
  },
  Age: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  HOF_PHONE: {
    type: String,
    required: true,
  },
  HOF_ADDRESS: {
    type: String,
    required: true,
  },
  PREVIOUS_TAKHMEEN: {
    type: String,
    required: false,
  },
  isHOF: {
    type: Boolean,
    require: false,
  },
});

module.exports = mongoose.model("hofs", HofDetailsSchema);

const mongoose = require("mongoose");

const ReceiptsSchema = new mongoose.Schema({
  receiptNo: {
    type: String,
    required: true,
  },
  formNo: {
    type: String,
    required: true,
  },
  markaz: {
    type: String,
    required: false,
  },
  HOFId: {
    type: String,
    required: true,
  },
  HOFName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("receipts", ReceiptsSchema);

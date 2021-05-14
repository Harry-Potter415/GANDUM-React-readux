const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const NewsletterSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  status: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
});

module.exports = mongoose.model("Newsletter", NewsletterSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
  customer_id: {
    type: Schema.ObjectId,
    ref: "Customer",
    required: true,
  },
  billing: {
    firstname: String,
    lastname: String,
    company: String,
    address: String,
    city: String,
    zip: String,
    country: String,
    state: String,
    email: String,
    phone: String,
    payment_method: String,
    transaction_id: String,
  },
  shipping: {
    firstname: String,
    lastname: String,
    company: String,
    address_line_1: String,
    address_line_2: String,
    city: String,
    zip: String,
    country: String,
    state: String,
    notes: String,
  },
  products: [
    {
      product_id: {
        type: Schema.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      cost: {
        type: Number,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
    },
  ],
  paymentMethod: {
    type: String,
  },
  subtotal: {
    type: Number,
  },
  total: {
    type: Number,
  },
  status: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
  },
});

module.exports = mongoose.model("Order", OrderSchema);

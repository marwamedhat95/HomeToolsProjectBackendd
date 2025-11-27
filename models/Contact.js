const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  address: { type: String, required: true },
  phone: { type: String, required: true },
  facebook: String,
  twitter: String,
  instagram: String,
});

module.exports = mongoose.model("Contact", contactSchema);

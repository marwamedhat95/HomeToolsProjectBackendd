const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  buttonText: { type: String },
  buttonLink: { type: String },
  background: { type: String }, // اسم الصورة
});

module.exports = mongoose.model("Hero", heroSchema);

const mongoose = require("mongoose");

const adsSchema = new mongoose.Schema({
  image: String,   // اسم الصورة
  link: String     // لينك الإعلان
});

module.exports = mongoose.model("Ads", adsSchema);

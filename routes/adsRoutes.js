const express = require("express");
const router = express.Router();
const Ads = require("../models/adsModel");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// إعداد Cloudinary
cloudinary.config({
cloud_name: process.env.CLOUD_NAME,
api_key: process.env.CLOUD_KEY,
api_secret: process.env.CLOUD_SECRET,
});

// Multer مؤقت فقط (لرفع الصورة قبل Cloudinary)
const upload = multer({ dest: "temp/" });

// -------------------
// GET – جلب كل الإعلانات
// -------------------
router.get("/", async (req, res) => {
try {
const ads = await Ads.find().sort({ _id: -1 });
res.json(ads); // الصورة URL كامل من Cloudinary
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// -------------------
// POST – إضافة إعلان جديد (رفع Cloudinary)
// -------------------
router.post("/", upload.single("image"), async (req, res) => {
try {
if (!req.file || !req.body.link)
return res.status(400).json({ error: "Image and link are required" });


console.log("File received:", req.file);
console.log("Link received:", req.body.link);

// رفع الصورة لـ Cloudinary
const uploaded = await cloudinary.uploader.upload(req.file.path, {
  folder: "ads",
});
console.log("Cloudinary uploaded:", uploaded);

// حذف الملف المؤقت
fs.unlinkSync(req.file.path);

// حفظ الإعلان في الداتا
const newAd = new Ads({
  image: uploaded.secure_url, // الرابط النهائي من Cloudinary
  link: req.body.link,
});

await newAd.save();
res.json(newAd);


} catch (err) {
console.error("ERROR IN /ads POST:", err);
res.status(500).json({ error: err.message });
}
});

// -------------------
// DELETE – حذف إعلان
// ممكن تضيفي كمان حذف الصورة من Cloudinary إذا حبيتي
// -------------------
router.delete("/:id", async (req, res) => {
try {
await Ads.findByIdAndDelete(req.params.id);
res.json({ message: "Deleted" });
} catch (err) {
res.status(500).json({ error: err.message });
}
});

module.exports = router;

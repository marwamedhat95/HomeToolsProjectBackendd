const express = require("express");
const router = express.Router();
const Ads = require("../models/adsModel");
const multer = require("multer");
const path = require("path");

// إعداد multer لحفظ الصور
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// GET – جلب كل الإعلانات
router.get("/", async (req, res) => {
  try {
    const ads = await Ads.find().sort({ _id: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST – إضافة إعلان جديد
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.body.link) return res.status(400).json({ error: "Image and link are required" });

    const newAd = new Ads({
      image: req.file.filename,
      link: req.body.link,
    });

    await newAd.save();
    res.json(newAd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE – حذف إعلان
router.delete("/:id", async (req, res) => {
  try {
    await Ads.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

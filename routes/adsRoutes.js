const express = require("express");
const router = express.Router();
const Ads = require("../models/adsModel");

// -------------------
// GET – جلب كل الإعلانات
// -------------------
router.get("/", async (req, res) => {
  try {
    const ads = await Ads.find().sort({ _id: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------
// POST – إضافة إعلان جديد (رابط Cloudinary جاهز)
// -------------------
router.post("/", async (req, res) => {
  try {
    const { image, link } = req.body;

    if (!image || !link) {
      return res.status(400).json({ error: "Image and link are required" });
    }

    const newAd = new Ads({
      image, // الرابط من Cloudinary مباشرة
      link,
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

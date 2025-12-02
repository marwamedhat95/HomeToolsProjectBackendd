// routes/hero.js
const express = require("express");
const router = express.Router();
const Hero = require("../models/Hero");
const multer = require("multer");

// إعداد multer لتخزين الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET الهيرو
router.get("/", async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero || {});
  } catch (err) {
    res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات الهيرو" });
  }
});

// PUT لتحديث الهيرو
router.put("/", upload.single("background"), async (req, res) => {
  try {
    const { title, description, buttonText, buttonLink } = req.body;
    const background = req.file ? req.file.filename : null;

    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero({
        title,
        description,
        buttonText,
        buttonLink,
        background,
      });
    } else {
      hero.title = title;
      hero.description = description;
      hero.buttonText = buttonText;
      hero.buttonLink = buttonLink;
      if (background) hero.background = background;
    }

    await hero.save();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: "حدث خطأ أثناء تحديث الهيرو" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Hero = require("../models/Hero");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// استخدام memoryStorage بدل التخزين على القرص
const upload = multer({ storage: multer.memoryStorage() });

// GET الهيرو
router.get("/", async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero || {});
  } catch (err) {
    res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات الهيرو" });
  }
});

// PUT لتحديث الهيرو مع Cloudinary
router.put("/", upload.single("background"), async (req, res) => {
  try {
    const { title, description, buttonText, buttonLink } = req.body;
    let backgroundUrl = null;

    if (req.file) {
      // رفع الصورة على Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "hero" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      backgroundUrl = result.secure_url; // اللينك النهائي للصورة
    }

    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero({
        title,
        description,
        buttonText,
        buttonLink,
        background: backgroundUrl,
      });
    } else {
      hero.title = title;
      hero.description = description;
      hero.buttonText = buttonText;
      hero.buttonLink = buttonLink;
      if (backgroundUrl) hero.background = backgroundUrl; // استبدال اللينك القديم
    }

    await hero.save();
    res.json(hero);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "حدث خطأ أثناء تحديث الهيرو" });
  }
});

module.exports = router;

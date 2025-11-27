const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/videos/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ========== ADD NEW VIDEO ==========
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, type, url, category } = req.body;

    const data = {
      title,
      type,
      url: type !== "file" ? url : null,
      filename: type === "file" ? req.file?.filename : null,
      category
    };

    const video = new Video(data);
    await video.save();

    res.json(video);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding video" });
  }
});


// ========== GET ALL VIDEOS ==========
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== UPDATE VIDEO ==========
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { title, type, url, category } = req.body;

    const updateData = {
      title,
      type,
      url: type !== "file" ? url : null,
      category
    };

    if (type === "file" && req.file) {
      updateData.filename = req.file.filename;
    }

    const video = await Video.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(video);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating video" });
  }
});
// ========== DELETE VIDEO ==========
router.delete("/:id", async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting video" });
  }
});

module.exports = router;

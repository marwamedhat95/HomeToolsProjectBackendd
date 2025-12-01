const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary'); // بدون .js
const streamifier = require('streamifier');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'products' },
    (error, result) => {
      if (error) return res.status(500).json({ error });
      res.json({ url: result.secure_url });
    }
  );

  streamifier.createReadStream(file.buffer).pipe(stream);
});

module.exports = router;

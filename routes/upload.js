import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

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

export default router;

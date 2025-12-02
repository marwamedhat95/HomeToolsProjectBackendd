const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), (req, res) => {
console.log("---- Upload Route Hit ----");
console.log("req.file:", req.file);
console.log("req.body:", req.body);

const file = req.file;
if (!file) {
console.log("No file uploaded!");
return res.status(400).json({ error: "No file uploaded" });
}

const stream = cloudinary.uploader.upload_stream(
{ folder: 'products' },
(error, result) => {
if (error) {
console.log("Cloudinary Error:", error);
return res.status(500).json({ error });
}
console.log("Cloudinary Result:", result);
res.json({ url: result.secure_url });
}
);

streamifier.createReadStream(file.buffer).pipe(stream);
});

module.exports = router;

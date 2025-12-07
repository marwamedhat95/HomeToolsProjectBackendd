const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// إعداد Cloudinary
cloudinary.config({
cloud_name: 'dkhjcwrlw',
api_key: 'YOUR_API_KEY',
api_secret: 'YOUR_API_SECRET'
});

// إعداد Multer لتخزين مؤقت
const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, 'uploads/'),
filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// دالة لرفع الملفات على Cloudinary
const uploadToCloudinary = async (filePath) => {
const result = await cloudinary.uploader.upload(filePath);
fs.unlinkSync(filePath); // حذف الصورة بعد الرفع
return result.secure_url;
};

// إضافة منتج جديد
router.post("/", upload.array("images", 10), async (req, res) => {
try {
const color = Array.isArray(req.body.color) ? req.body.color : [req.body.color];

```
// رفع الصور على Cloudinary
const uploadedFiles = [];
for (const file of req.files) {
  const url = await uploadToCloudinary(file.path);
  uploadedFiles.push(url);
}

const newProduct = new Product({
  name: req.body.name,
  images: uploadedFiles,
  description: req.body.description,
  price: req.body.price,
  quantity: req.body.quantity,
  category: req.body.category,
  color,
  homeProduct: req.body.homeProduct || false,
  fridayOffer: req.body.fridayOffer || false
});

await newProduct.save();
res.json(newProduct);
```

} catch (err) {
console.log(err);
res.status(500).json({ error: "Error creating product" });
}
});

// جلب كل المنتجات
router.get('/', async (req, res) => {
try {
const products = await Product.find().populate('category', 'name');
res.json(products);
} catch (error) {
console.log(error);
res.status(500).json({ error: error.message });
}
});

// تعديل منتج
router.put('/:id', upload.array("images", 10), async (req, res) => {
try {
const updateData = {
name: req.body.name,
price: req.body.price,
quantity: req.body.quantity,
category: req.body.category,
description: req.body.description,
color: req.body.color ? (Array.isArray(req.body.color) ? req.body.color : [req.body.color]) : []
};

```
if (req.files && req.files.length > 0) {
  const uploadedFiles = [];
  for (const file of req.files) {
    const url = await uploadToCloudinary(file.path);
    uploadedFiles.push(url);
  }
  updateData.images = uploadedFiles;
}

const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
res.json({ message: "Product updated", product: updatedProduct });
```

} catch (error) {
console.log(error);
res.status(500).json({ error: error.message });
}
});

// حذف منتج
router.delete('/:id', async (req, res) => {
try {
await Product.findByIdAndDelete(req.params.id);
res.json({ message: 'Product deleted' });
} catch (error) {
console.log(error);
res.status(500).json({ error: error.message });
}
});

// جلب منتج واحد
router.get('/:id', async (req, res) => {
try {
const product = await Product.findById(req.params.id).populate('category', 'name');
res.json(product);
} catch (error) {
res.status(500).json({ error: error.message });
}
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ------------------- GET كل المنتجات -------------------
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------- GET منتج واحد -------------------
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- POST إضافة منتج -------------------
router.post('/', async (req, res) => {
  try {
    const { name, images, description, price, quantity, category, color, homeProduct, fridayOffer } = req.body;

    const newProduct = new Product({
      name,
      images, // array من روابط Cloudinary
      description,
      price: Number(price),
      quantity: Number(quantity),
      category,
      color: Array.isArray(color) ? color : [color],
      homeProduct: homeProduct === true || homeProduct === 'true',
      fridayOffer: fridayOffer === true || fridayOffer === 'true'
    });

    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------- PUT تحديث منتج -------------------
router.put('/:id', async (req, res) => {
  try {
    const { name, images, description, price, quantity, category, color, homeProduct, fridayOffer } = req.body;

    const updateData = {
      name,
      description,
      price,
      quantity,
      category,
      color: Array.isArray(color) ? color : [color],
      homeProduct: homeProduct === true || homeProduct === 'true',
      fridayOffer: fridayOffer === true || fridayOffer === 'true'
    };

    if (images && images.length > 0) updateData.images = images; // روابط Cloudinary

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json({ message: "تم التحديث بنجاح", product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------- DELETE حذف منتج -------------------
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف المنتج' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

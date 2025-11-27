const express = require('express');
const router = express.Router();
const Category = require('../models/categories');

// جلب كل الأقسام
router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// إضافة قسم جديد
router.post('/', async (req, res) => {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.json({ message: 'categories added' });
});

// تعديل قسم
router.put('/:id', async (req, res) => {
    await Category.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'categories updated' });
});

// حذف قسم
router.delete('/:id', async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'categories deleted' });
});

module.exports = router;



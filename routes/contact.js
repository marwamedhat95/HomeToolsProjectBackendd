const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// GET كل العناوين
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST إضافة عنوان جديد (عنوان واحد في كل مرة)
router.post("/", async (req, res) => {
  try {
    const { address, phone, facebook, twitter, instagram } = req.body;
    const newContact = new Contact({ address, phone, facebook, twitter, instagram });
    await newContact.save();
    res.json(newContact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT تعديل عنوان
router.put("/:id", async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Contact not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE حذف عنوان
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

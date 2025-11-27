const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    color: [String],
    homeProduct: { type: Boolean, default: false },
    fridayOffer: { type: Boolean, default: false },
    quantity: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

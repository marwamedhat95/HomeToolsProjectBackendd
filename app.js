const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: "https://jazzy-crostata-402499.netlify.app",
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const productsRoute = require('./routes/products');
const categoriesRoute = require('./routes/categories');
const videosRoute = require('./routes/videos');
const contactRouter = require("./routes/contact");
const heroRouter = require("./routes/hero");
// const homeProductsRouter = require("./routes/homeProducts");
// const contactRoute = require('./routes/contact');
const adsRoutes = require("./routes/adsRoutes");
app.use("/api/ads", adsRoutes);
app.use('/api/products', productsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/videos', videosRoute);
app.use("/api/contacts", contactRouter);
app.use("/api/hero", heroRouter);
// app.use("/api/homeProducts", homeProductsRouter);
// app.use('/api/contact', contactRoute);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));





app.get('/', (req, res) => {
  res.send('Backend is running!');
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

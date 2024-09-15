const express = require('express');
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');
const app = express();

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname.split('.')[0] + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Set view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Home route
app.get('/', (req, res) => {
  res.render('index', { imageUrl: null, qrCodeDataUrl: null });
});

// Handle image upload and QR code generation
app.post('/upload', upload.single('image'), async (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  const qrCodeDataUrl = await QRCode.toDataURL(imageUrl);
  res.render('index', { imageUrl, qrCodeDataUrl });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
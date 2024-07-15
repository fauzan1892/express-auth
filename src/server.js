const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Menggunakan body-parser untuk menangani JSON dan URL encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Menggunakan multer untuk menangani form-data
const upload = multer();
app.use(upload.none());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    const isPDF = ext === 'pdf';

    return {
      folder: 'documents', // ✅ Use neutral folder
      resource_type: isPDF ? 'raw' : 'auto', // ✅ Important
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf']
    };
  },
});


const upload = multer({ storage });

module.exports = { cloudinary, upload };
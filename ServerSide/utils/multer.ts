import multer from 'multer';
import fs from 'fs';

// Ensure the uploads directory exists
if (!fs.existsSync("uploads")) {
  try {
    fs.mkdirSync("uploads");
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Configure multer with limits and file type validation
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false); // Reject the file
      return cb(new Error('Only .jpeg and .png file types are allowed'));
    }
  },
});

export default upload;

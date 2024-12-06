import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Ensure this is added in your .env file
});

export const uploadImage = async (filePath: string): Promise<string> => {
  if (!filePath) {
    throw new Error('File path is required for uploading');
  }

  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'menu-images', // Optional: organizes files in a specific folder
    });
    return result.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error.message);
    throw new Error('Image upload failed');
  }
};

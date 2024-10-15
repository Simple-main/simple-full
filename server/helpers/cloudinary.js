require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Use memory storage for multer to store files in memory (instead of disk)
const storage = new multer.memoryStorage();

// Utility function to upload an image file to Cloudinary
async function imageUploadUtil(file) {
  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto", // Allows various file types (images, videos, etc.)
    });

    // Return the result of the upload
    return result;
  } catch (error) {
    // Handle errors in case the upload fails
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
}

// Configure multer to use memory storage
const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };

import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,  // cloud_name from the .env file
    api_key: process.env.API_KEY,        // api_key from the .env file
    api_secret: process.env.API_SECRET   // api_secret from the .env file
  });
export default cloudinary;
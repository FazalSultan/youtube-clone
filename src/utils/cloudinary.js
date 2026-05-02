import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_KEY_SECRET,
});

const cloudinaryUploadFile = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    console.error("An error is occured while Uploading your Media ...", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { cloudinaryUploadFile };

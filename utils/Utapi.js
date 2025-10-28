'use server'
import { UTApi } from "uploadthing/server";  // Import the UTApi
import { v2 as cloudinary } from 'cloudinary';
// Initialize the Uploadthing API instance
const utApi = new UTApi();

export async function deleteFileFromUploadthing(key) {
    try {
        const response = await utApi.deleteFiles(key); // Assuming `deleteFiles` is the correct method

        if (!response.success) { // Check if success is true
            throw new Error('Failed to delete file from Server');
        }
        
        return true; // Return true if the file deletion was successful
    } catch (error) {
        console.error('Error deleting file from Server:', error);
        return false; // Return false if deletion fails
    }
}
export async function deleteFileFromCloudinary(publicId) {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    if (response.result !== 'ok') {
      throw new Error('Failed to delete file from Cloudinary');
    }
    return true;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return false;
  }
}

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cloudinary automatically picks up CLOUDINARY_URL from process.env
cloudinary.config({
    secure: true
});

/**
 * Uploads a file to Cloudinary
 * @param {Object} fileObject - Multer file object
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
exports.uploadFile = async (fileObject) => {
    try {
        const result = await cloudinary.uploader.upload(fileObject.path, {
            folder: 'sonal_mp_2', // Optional: organized folder
            use_filename: true,
            unique_filename: true,
        });

        // Clean up temp file
        if (fs.existsSync(fileObject.path)) {
            fs.unlinkSync(fileObject.path);
        }

        return result.secure_url;

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        // Clean up temp file on error too
        if (fs.existsSync(fileObject.path)) {
            fs.unlinkSync(fileObject.path);
        }
        throw error;
    }
};

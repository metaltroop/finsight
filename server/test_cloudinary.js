require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Explicitly print what we loaded (partially masked)
// Cloudinary automatically picks up CLOUDINARY_URL from process.env if present
console.log('CLOUDINARY_URL present:', !!process.env.CLOUDINARY_URL);

cloudinary.config({
    secure: true
});

// Create a dummy file to upload
const testFile = path.join(__dirname, 'test_image.txt');
fs.writeFileSync(testFile, 'This is a test image content');

async function testUpload() {
    try {
        console.log('Attempting upload...');
        const result = await cloudinary.uploader.upload(testFile, {
            resource_type: 'raw',
            folder: 'test_folder',
        });
        console.log('Upload Success!');
        console.log('URL:', result.secure_url);
    } catch (error) {
        console.error('Upload Failed!');
        console.error(error);
    } finally {
        if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    }
}

testUpload();

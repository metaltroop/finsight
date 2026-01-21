const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const KEYFILEPATH = path.join(__dirname, '../driveKeys/hazel-logic-483503-j9-e0eef911052e.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Uploads a file to Google Drive
 * @param {Object} fileObject - Multer file object
 * @returns {Promise<string>} - The webViewLink (public URL) or webContentLink
 */
exports.uploadFile = async (fileObject) => {
    try {
        const folderId = process.env.DRIVE_FOLDER_ID; // Must be in .env
dp
        const fileMetadata = {
            name: `${Date.now()}-${fileObject.originalname}`,
            parents: folderId ? [folderId] : [], // Optional: verify if folderId is required or root
        };

        const media = {
            mimeType: fileObject.mimetype,
            body: fs.createReadStream(fileObject.path),
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, name, webViewLink, webContentLink',
        });

        // Make the file publicly readable (optional, depending on use case)
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Clean up temp file
        fs.unlinkSync(fileObject.path);

        // Return a directly usable image link if possible, or the view link
        // Note: webContentLink is for downloading, webViewLink is for viewing
        // For <img> tags, often a thumbnail link or ID-based proxy is better, 
        // but let's return webViewLink for now.
        // A common trick for direct images is: https://drive.google.com/uc?id=FILE_ID
        const link = `https://drive.google.com/uc?export=view&id=${response.data.id}`;

        fs.appendFileSync(path.join(__dirname, '../debug_log.txt'), `${new Date().toISOString()} - SUCCESS: Uploaded ${fileObject.originalname} -> ${link}\n`);

        return link;

    } catch (error) {
        console.error('Drive upload error:', error);
        fs.appendFileSync(path.join(__dirname, '../debug_log.txt'), `${new Date().toISOString()} - ERROR: ${error.message}\n${error.stack}\n`);

        // Clean up temp file on error too
        if (fs.existsSync(fileObject.path)) fs.unlinkSync(fileObject.path);
        throw error;
    }
};

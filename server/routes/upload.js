const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const cloudinaryService = require('../services/cloudinaryService');
const { isAdmin } = require('../middlewares/auth');

// Multer config for temp storage
const upload = multer({ dest: 'uploads/' });

router.post('/', isAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileLink = await cloudinaryService.uploadFile(req.file);
        res.json({ url: fileLink });

    } catch (error) {
        res.status(500).json({ error: 'Upload failed', details: error.message });
    }
});

module.exports = router;

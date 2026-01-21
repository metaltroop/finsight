const router = require('express').Router();
const blogController = require('../controller/blogController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', blogController.getAllBlogs);
router.get('/:slug', blogController.getBlogBySlug);
router.post('/', isAdmin, upload.single('image'), blogController.createBlog);
router.put('/:id', isAdmin, upload.single('image'), blogController.updateBlog);
router.put('/:id/toggle-popular', isAdmin, blogController.togglePopular);
router.delete('/:id', isAdmin, blogController.deleteBlog);

module.exports = router;

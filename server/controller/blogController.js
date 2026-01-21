const prisma = require('../config/db');

exports.getAllBlogs = async (req, res) => {
    try {
        const { popular, search } = req.query;
        const where = { published: true };

        if (popular === 'true') {
            where.isPopular = true;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }

        const blogs = await prisma.blog.findMany({
            where,
            include: { author: { select: { name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs', error: err.message });
    }
};

exports.togglePopular = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await prisma.blog.findUnique({ where: { id } });

        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: { isPopular: !blog.isPopular }
        });

        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ message: 'Error updating blog status', error: err.message });
    }
};

exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: { slug: req.params.slug },
            include: { author: { select: { name: true, avatar: true } } }
        });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blog', error: err.message });
    }
};

const cloudinaryService = require('../services/cloudinaryService');

const calculateReadTime = (content) => {
    if (!content) return "1 min read";
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
};

exports.createBlog = async (req, res) => {
    let { title, slug, content, tags } = req.body;
    let coverImage = req.body.coverImage; // Fallback if no file

    // Calculate Read Time
    const readTime = calculateReadTime(content);

    // Parse tags to array if string
    if (typeof tags === 'string') {
        // Split by comma, trim whitespace, remove empty strings
        tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } else if (!Array.isArray(tags)) {
        tags = [];
    }

    try {
        if (req.file) {
            coverImage = await cloudinaryService.uploadFile(req.file);
        }

        const newBlog = await prisma.blog.create({
            data: {
                title,
                slug,
                content,
                coverImage,
                readTime,
                tags,
                published: true,
                authorId: req.user.id
            }
        });
        res.status(201).json(newBlog);
    } catch (err) {
        console.error("Create Blog Error:", err);
        res.status(400).json({ message: 'Error creating blog', error: err.message });
    }
};

exports.updateBlog = async (req, res) => {
    let { title, content, tags, published } = req.body;
    let coverImage = req.body.coverImage;

    // Parse tags to array if string
    if (typeof tags === 'string') {
        tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    try {
        if (req.file) {
            coverImage = await cloudinaryService.uploadFile(req.file);
        }

        // Prepare update data
        const updateData = { title, content, tags, published };
        if (content) {
            updateData.readTime = calculateReadTime(content);
        }
        if (coverImage) updateData.coverImage = coverImage;

        const updatedBlog = await prisma.blog.update({
            where: { id: req.params.id },
            data: updateData
        });
        res.json(updatedBlog);
    } catch (err) {
        console.error("Update Blog Error:", err);
        res.status(400).json({ message: 'Error updating blog', error: err.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        await prisma.blog.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting blog', error: err.message });
    }
};

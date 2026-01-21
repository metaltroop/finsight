const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStats = async (req, res) => {
    try {
        // Run all count queries in parallel for maximum speed
        const [userCount, blogCount, leadCount] = await Promise.all([
            prisma.user.count(),
            prisma.blog.count(),
            prisma.lead.count()
        ]);

        res.json({
            users: userCount,
            blogs: blogCount,
            leads: leadCount
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

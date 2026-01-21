const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const calculateReadTime = (content) => {
    if (!content) return "1 min read";
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
};

async function main() {
    console.log("Starting read time update...");

    try {
        const blogs = await prisma.blog.findMany();
        console.log(`Found ${blogs.length} blogs.`);

        for (const blog of blogs) {
            const readTime = calculateReadTime(blog.content);
            await prisma.blog.update({
                where: { id: blog.id },
                data: { readTime: readTime }
            });
            console.log(`Updated blog: ${blog.title} -> ${readTime}`);
        }

        console.log("All blogs updated successfully!");

    } catch (e) {
        console.error("Error updating blogs:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.saveEntry = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { type, inputData, resultData } = req.body;

        // Define "Today" range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Check if entry exists for this user, this type, today
        const existingEntry = await prisma.calculatorEntry.findFirst({
            where: {
                userId,
                type,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        if (existingEntry) {
            // Update existing entry for today
            const updated = await prisma.calculatorEntry.update({
                where: { id: existingEntry.id },
                data: {
                    inputData,
                    resultData,
                    createdAt: new Date() // Optional: touch timestamp to show latest edit time, or use updatedAt if schema had it
                }
            });
            return res.json({ message: 'Entry updated (Same Day)', id: updated.id });
        }

        // Create new if none exists today
        const entry = await prisma.calculatorEntry.create({
            data: {
                type,
                inputData,
                resultData,
                userId
            }
        });

        res.status(201).json({ message: 'Entry saved', id: entry.id });
    } catch (error) {
        console.error('Calculator save error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        const history = await prisma.calculatorEntry.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { inputData, resultData } = req.body;

        // Verify ownership
        const existingEntry = await prisma.calculatorEntry.findUnique({
            where: { id }
        });

        if (!existingEntry) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        if (existingEntry.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const updatedEntry = await prisma.calculatorEntry.update({
            where: { id },
            data: {
                inputData,
                resultData
            }
        });

        res.json({ message: 'Entry updated', id: updatedEntry.id });
    } catch (error) {
        console.error('Calculator update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

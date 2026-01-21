const prisma = require('../config/db');

// Export models directly if needed, but Prisma Client usually handles this.
// Use this file to centralize model access if we want to wrap them later.
module.exports = prisma;

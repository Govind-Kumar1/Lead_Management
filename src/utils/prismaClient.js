const { PrismaClient } = require('../generated/prisma'); // still correct

const prisma = new PrismaClient();

module.exports = { prisma };
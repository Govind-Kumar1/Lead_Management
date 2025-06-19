const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new followup
const createFollowup = async (req, res) =>{
  try {
    const followup = await prisma.followup.create({
      data: req.body,
    });
    res.status(201).json(followup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 

// Get all followups
const getFollowups = async (req, res) =>{
  try {
    const followups = await prisma.followup.findMany();
    res.json(followups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single followup by ID
const getFollowupById = async (req, res) =>{
  try {
    const followup = await prisma.followup.findUnique({
      where: { id: req.params.id },
    });
    if (!followup) return res.status(404).json({ error: 'Followup not found' });
    res.json(followup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a followup
const updateFollowup = async (req, res) => {
  try {
    const followup = await prisma.followup.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(followup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a followup
const deleteFollowup = async (req, res) => {
  try {
    await prisma.followup.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Followup deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
    createFollowup,
    getFollowups,
    getFollowupById,
    updateFollowup,
    deleteFollowup
}
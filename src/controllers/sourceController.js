const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//  const PrismaClient = require('../generated/prisma')
 
const createSource = async (req, res) =>{
  try {
    const source = await prisma.source.createMany({
      data: req.body
    }); 
    res.status(201).json(source); 
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error(error)
  }
}; 

// Get all sources 
const getSources = async (req, res) => {
  try {
    // const leads = await prisma.source.findMany();
    const sources = await prisma.source.findMany();
    res.status(200).json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
};

// Get a single source by ID
const getSourceById = async (req, res) =>{
  try {
    const source = await prisma.source.findUnique({
      where: { id: req.params.id },
    });
    if (!source) return res.status(404).json({ error: 'Source not found' });
    res.json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a source
const updateSource = async (req, res) => {
  try {
    const source = await prisma.source.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(source);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a source
const deleteSource = async (req, res)=>{
  try {
    await prisma.source.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Source deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 

module.exports = {
  createSource,
  getSources,
  getSourceById,
  updateSource,
  deleteSource,
};
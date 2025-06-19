const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // <-- yeh line add karo

// Define routes
router.get('/', getLeads);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

// CSV upload route
router.post('/upload-csv', upload.single('file'), async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      results.push({
        ...data,
        lead_score: data.lead_score ? parseInt(data.lead_score, 10) : null,
        assigned_to: data.assigned_to ? String(data.assigned_to) : null,
      });
    })
    .on('end', async () => {
      try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        // Filter out invalid leads
        const validLeads = results.filter(lead => lead.name);
        if (validLeads.length === 0) {
          return res.status(400).json({ message: 'No valid leads with name found in CSV.' });
        }
        // Bulk create
        const created = await prisma.lead.createMany({ data: validLeads });
        res.status(201).json({ count: created.count, message: 'Leads uploaded successfully.' });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    })
    .on('error', (err) => {
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;

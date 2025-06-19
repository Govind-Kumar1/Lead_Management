const express = require('express');
const router = express.Router();
// const { getLeads, createLead, updateLead,deleteLead } = require('../controllers/leadController');
const {createSource,getSources,getSourceById,updateSource,deleteSource} = require('../controllers/sourceController')

router.post('/', createSource);
router.get('/', getSources);
router.get('/:id', getSourceById);
router.put('/:id', updateSource);
router.delete('/:id',deleteSource);

module.exports = router;
const express = require('express');
const { 
  createFollowup, 
  getFollowups, 
  getFollowupById, 
  updateFollowup, 
  deleteFollowup 
} = require('../controllers/followupController');

const router = express.Router();

router.post('/', createFollowup);
router.get('/', getFollowups); 
router.get('/:id', getFollowupById);
router.put('/:id', updateFollowup);
router.delete('/:id', deleteFollowup);

module.exports = router;
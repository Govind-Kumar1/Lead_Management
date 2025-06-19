const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log("Lead model:", typeof prisma.lead !== 'undefined' ? '✅ Available' : '❌ Missing');
console.log("User model:", typeof prisma.user !== 'undefined' ? '✅ Available' : '❌ Missing');
console.log("Source model:", typeof prisma.source !==  'undefined' ? '✅ Available' : '❌ Missing');
console.log("Followup model:", typeof prisma.followup !== 'undefined' ? '✅ Available' : '❌ Missing');
console.log("Activity model:", typeof prisma.activity !== 'undefined' ? '✅ Available' : '❌ Missing');
// Example scoring function
function calculateLeadScore(lead) {
  let score = 0;

  // Example criteria (customize as needed)
  if (lead.source_id === 'important_source_id') score += 30;
  if (lead.industry && lead.industry.toLowerCase() === 'it') score += 20;
  if (lead.budget && Number(lead.budget) > 100000) score += 25;
  if (lead.behavior && lead.behavior === 'high') score += 15;

  // Default score if nothing matches
  if (score === 0) score = 10;

  return score;
}

// Auto-assign function: finds user with matching location and least workload
async function autoAssignUser(lead) {
  // Try to find users matching lead location, sorted by workload asc
  const users = await prisma.user.findMany({
    where: lead.location ? { location: lead.location } : {},
    orderBy: { workload: 'asc' },
    take: 1,
  });
  // If found, return user id, else return null
  return users.length > 0 ? users[0].id : null;
}

const createLead = async (req, res) => {   
  try {
    // Auto-assign if assigned_to not provided
    let assigned_to = req.body.assigned_to;
    if (!assigned_to) {
      assigned_to = await autoAssignUser(req.body);
    }

    const leadData = {
      ...req.body,
      assigned_to, // auto or manual
      lead_score: calculateLeadScore(req.body),
    };
    const lead = await prisma.lead.create({ data: leadData });
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });  
    console.error(error);
  }
}; 

const getLeads = async (req,res) =>{ 
  try{
    const leads = await prisma.lead.findMany({where: req.query});
    res.json(leads); 
  }
  catch(err){ 
    res.status(500).json({message:err.message}); 
  }
}

const updateLead = async (req, res) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: req.body, 
    });
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
};
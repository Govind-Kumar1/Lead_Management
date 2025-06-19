const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// create a new activity
const createActivity = async (req,res)=>{
    try{
        const activity = await prisma.activity.create({
            data:req.body,
        });
        res.status(201).josn(activity);
    }
    catch(err){
        res.status(400).json({error:err.message});
        console.error(err);
    }
}
// get all activities
const getActivities = async (req,res)=>{
    try{
        const activities =await prisma.activity.findMany();
        res.json(activities);
   }
   catch(err){
    res.status(500).json({error:err.message});
   }
}
// get a single activity by ID
const getActivityById = async (req,res) =>{
    try{
        const activity = await prisma.activity.findUnique({
        where:{id:req.params.id},
        });
        if(!activity) return res.status(404).json({error:"Activity not found"});
        res.json(activity);
}
    catch(err){
        res.status(500).json({error:err.message});
    }
    
};
// update an activity
const updateActivity =async (req,res)=>{
    try{
        const activity = await prisma.activity.update({
            where:{id:req.params.id},
            data:req.body,
        });
        res.json(activity);
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}
// delete an activity
const deleteActivity = async (req,res)=>{
    try{
        await prisma.activity.delete({
            where:{id:req.params.id},
        });
        res.json({message:"Activity deleted"});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
}
module.exports = {
    createActivity,
    getActivities,
    getActivityById,
    updateActivity,
    deleteActivity,
};
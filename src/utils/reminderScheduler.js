const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Setup nodemailer transporter (example with Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.REMINDER_EMAIL,      // Your email
    pass: process.env.REMINDER_EMAIL_PASS, // Your email password or app password
  },
});

// Cron job: runs every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const nextMinute = new Date(now.getTime() + 60 * 1000);

  // Find followups due in the next minute and not completed
  const dueFollowups = await prisma.followup.findMany({
    where: {
      followup_date: {
        gte: now,
        lt: nextMinute,
      },
      completed: false,
    },
    include: {
      lead: true, // If you want lead info (make sure relation exists)
    },
  });

  for (const followup of dueFollowups) {
    // Get user email (fetch from User table if needed)
    // Example: const user = await prisma.user.findUnique({ where: { id: followup.created_by } });

    // Send email
    await transporter.sendMail({
      from: process.env.REMINDER_EMAIL,
      to: 'sales@example.com', // Replace with dynamic user email
      subject: `Follow-up Reminder for Lead: ${followup.lead_id}`,
      text: `You have a follow-up scheduled for lead ${followup.lead_id} at ${followup.followup_date}.\nNote: ${followup.note || ''}`,
    });

    console.log(`Reminder sent for followup ${followup.id}`);
  }
});
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();
 
const app = express();
require('./utils/reminderScheduler')
// File upload routes (multer) pehle

// JSON middleware baad me 
app.use(express.json());
app.use('/api/leads', require('./routes/leadRoutes'));

// Baaki routes
 app.use('/api/sources', require('./routes/sourceRoutes')); 
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/followups', require('./routes/followupRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
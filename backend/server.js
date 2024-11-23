import express from 'express';
import cors from 'cors';  // Import CORS
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminroutes from './routes/adminroutes.js';

dotenv.config();

const app = express();

// Enable CORS for all routes and all origins
app.use(cors());

connectDB();

app.use(express.json());

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.use('/api/admin', adminroutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

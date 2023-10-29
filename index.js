import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectDB } from './configs/database_config.js';

import userRoutes from './routes/user_routes.js';
import authRoutes from './routes/auth_routes.js';
const app = express();

const port = process.env.PORT || 5000;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;


// CORS Policy
app.use(cors())

// Connect to database
connectDB(MONGO_CONNECTION_STRING);

// Json
app.use(express.json());

// Load routes
app.use("/api/user", userRoutes);
app.use("/api/", authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})

app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
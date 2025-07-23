import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

import express from "express";
import cors from "cors";
import { connect } from './routes/users/db.js';
import newsRouter from './routes/news/news.js';
import usersRouter from './routes/users/users.js';
import queriesRouter from './routes/queries/queries.js';


const app = express();
const port = process.env.PORT || 4000; 

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow React dev server
  credentials: true
}));

app.use(express.json());

app.use('/news', newsRouter);
app.use('/users', usersRouter);
app.use('/queries', queriesRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

connect();

connect();

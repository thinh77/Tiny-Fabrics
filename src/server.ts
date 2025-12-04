import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import productsRouter from './routes/products';
import uploadRouter from './routes/upload';
import authRouter from './routes/auth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to Tiny Fabrics API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/auth', authRouter);

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { apiLimiter } from './middleware/rateLimiter';
import { initializeDb } from './config/db';

import authRoutes from './routes/authRoutes';
import memberRoutes from './routes/memberRoutes';
import activityRoutes from './routes/activityRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import ticketRoutes from './routes/ticketRoutes';
import accessRoutes from './routes/accessRoutes';
import transactionRoutes from './routes/transactionRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import statsRoutes from './routes/statsRoutes';

// Charge le fichier .env
dotenv.config({ path: path.join(__dirname, '../.env') }); 


const app = express();
const PORT = process.env.PORT || 5000;

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gym Management API',
      version: '1.0.0',
      description: 'API for managing gym members, subscriptions, and products',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Security Middlewares
app.use(helmet()); // Sets generic security headers
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
    ], // Allow Vue & React dev servers
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(apiLimiter); // Apply general rate limiting

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stats', statsRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Gym Central API is running (TypeScript + Express + Prisma)',
  });
});

app.listen(PORT, async () => {
  await initializeDb();
  console.log(`Server is running on port ${PORT}`);
});

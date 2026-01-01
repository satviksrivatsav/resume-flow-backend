import express from 'express'
import aiRoutes from './src/routes/ai.routes.js';
import cors from 'cors';

const app = express()
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    endpoints: {
      field: 'POST /api/v1/ai/field'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(port, () => {
  console.log(`Resume Flow API running on port ${port}`)
});

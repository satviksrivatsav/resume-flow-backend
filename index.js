import express from 'express'
import aiRoutes from './src/routes/ai.routes.js';
import cors from 'cors'; // Good practice to add verify if user needs it, but start with basic

const app = express()
const port = 3000


app.use(express.json());
app.use(cors());
// app.use(express.static('.')); // User asked to remove test.html concept, so we can remove static serving of root if not needed, or keep it. I will keep it for now but remove the file.

// Mount specific routes
app.use('/api/v1/ai', aiRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Resume Flow Backend API is running.',
    endpoints: {
      chat: 'POST /api/ai/chat'
    }
  });
})


// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', method: req.method, path: req.path });
});

const server = app.listen(port, () => {
  console.log(`Server app listening on port ${port}`)
})

// HACK: Force the process to stay alive to debug why it's exiting
setInterval(() => {
  // console.log('Heartbeat: Process is still alive');
}, 10000);

// Debugging: Log why the process is exiting
process.on('exit', (code) => {
  console.log(`Process is exiting with code: ${code}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

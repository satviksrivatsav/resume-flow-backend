import express from 'express';
import { handleFieldRequest } from '../controllers/ai.controller.js';

const router = express.Router();

// Field-level AI endpoint
router.post('/field', handleFieldRequest);

export default router;

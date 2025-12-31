import express from 'express';
import { handleChat } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/process', handleChat);

export default router;

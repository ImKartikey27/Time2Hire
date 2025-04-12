import express from 'express';
import { startConversation, processResponse, getCandidate } from '../controllers/voiceController.js';

const router = express.Router();

// Initialize conversation endpoint
router.post('/voice/start', startConversation);

// Process response endpoint
router.post('/voice/respond', processResponse);

// Get candidate data endpoint
router.get('/voice/candidate/:id', getCandidate);

export default router;

import {Router} from 'express';
import { startConversation, processResponse, getCandidate } from '../controller/voice.controllers.js';

const router = Router();

// Initialize conversation endpoint
router.route("/start/:id").post(startConversation);

// Process response endpoint
router.route("/response").post( processResponse);

// Get candidate data endpoint
router.route("/candidate/:id").get(getCandidate);

export default router;

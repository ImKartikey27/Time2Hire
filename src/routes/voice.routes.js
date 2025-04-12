import {Router} from 'express';
import { startConversation, processResponse, getCandidate } from '../controller/voice.controllers.js';

const router = Router();

// Initialize conversation endpoint
router.route("/voice/start").post(startConversation);

// Process response endpoint
router.route("/voice/response").post( processResponse);

// Get candidate data endpoint
router.route("/voice/candidate/:id").get(getCandidate);

export default router;

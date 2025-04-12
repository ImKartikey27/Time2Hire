import { Router } from "express";
import {
  createCandidate,
  deleteCandidate,
  getCandidateDetail,
  getCandidates,
  updateCandidate,
  updateConversationHistory
} from "../controller/candidate.controllers.js";
import { verifyJWT } from "../middelwares/auth.middlewares.js";

const router = Router();

// Unsecured routes
router.route("/get-candidates").get(getCandidates);
router.route("/get-candidate/:id").get(getCandidateDetail);

// Secured routes
router.route("/create-candidate").post(verifyJWT, createCandidate);
router.route("/update-candidate/:id").put(verifyJWT, updateCandidate);
router.route("/delete-candidate/:id").delete(verifyJWT, deleteCandidate);
router.route("/update-conversation/:id").post(verifyJWT, updateConversationHistory);

export default router;
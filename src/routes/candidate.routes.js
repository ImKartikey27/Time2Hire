import { Router } from "express";
import {
    createCandidate,
    deleteCandidate,
    getCandidateDetail,
    getCandidates,
    updateCandidate,
} from "../controller/candidate.controllers.js";

const router = Router();    

//unsecured routes
router.route("/get-candidates").get(getCandidates);
router.route("/get-candidate/:id").get(getCandidateDetail); 

//secured routes
router.route("/create-candidate").post(createCandidate);
router.route("/update-candidate/:id").put(updateCandidate);
router.route("/delete-candidate/:id").delete(deleteCandidate);

export default router
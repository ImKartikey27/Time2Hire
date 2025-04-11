import { Router } from "express";
import {
    createCandidate,
    deleteCandidate,
    getCandidateDetail,
    getCandidates,
    updateCandidate,
} from "../controller/candidate.controllers.js";
import { verifyJWT } from "../middelwares/auth.middlewares.js";

const router = Router();    

//unsecured routes
router.route("/get-candidates").get(getCandidates);
router.route("/get-candidate/:id").get(getCandidateDetail); 

//secured routes
router.route("/create-candidate").post(verifyJWT,createCandidate);
router.route("/update-candidate/:id").put(verifyJWT,updateCandidate);
router.route("/delete-candidate/:id").delete(verifyJWT,deleteCandidate);

export default router
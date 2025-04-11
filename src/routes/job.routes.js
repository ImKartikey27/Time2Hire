import { Router } from "express";
import {
    createJob,
    deleteJob,
    getJobDetail,
    getJobs,
    updateJob,
} from "../controller/job.controllers.js";
import { verifyJWT } from "../middelwares/auth.middlewares.js";

const router = Router();

//unsecured routes
router.route("/get-jobs").get(getJobs);
router.route("/get-job/:id").get(getJobDetail);

//secured routes
router.route("/create-job").post(verifyJWT, createJob);
router.route("/update-job/:id").put(verifyJWT, updateJob);
router.route("/delete-job/:id").delete(verifyJWT, deleteJob);

export default router;

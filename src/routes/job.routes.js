import { Router } from "express";
import {
    createJob,
    deleteJob,
    getJobDetail,
    getJobs,
    updateJob,
} from "../controller/job.controllers.js";

const router = Router();

//unsecured routes
router.route("/get-jobs").get(getJobs);
router.route("/get-job/:id").get(getJobDetail);

//secured routes
router.route("/create-job").post(createJob);
router.route("/update-job/:id").put(updateJob);
router.route("/delete-job/:id").delete(deleteJob);

export default router;

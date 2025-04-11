import { Router } from "express";
import {
    createAppointment,
    deleteAppointment,
    getAppointmentDetail,
    getAppointments,
    updateAppointment,
} from "../controller/appointment.controllers.js";
import { verifyJWT } from "../middelwares/auth.middlewares.js";

const router = Router();

//unsecured routes  
router.route("/get-appointments").get(getAppointments);
router.route("/get-appointment/:id").get(getAppointmentDetail);

//secured routes
router.route("/create-appointment").post(verifyJWT,createAppointment);
router.route("/update-appointment/:id").put(verifyJWT,updateAppointment);
router.route("/delete-appointment/:id").delete(verifyJWT,deleteAppointment);

export default router
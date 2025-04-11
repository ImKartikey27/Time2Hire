import { Router } from "express";
import {
    createAppointment,
    deleteAppointment,
    getAppointmentDetail,
    getAppointments,
    updateAppointment,
} from "../controller/appointment.controllers.js";

const router = Router();

//unsecured routes  
router.route("/get-appointments").get(getAppointments);
router.route("/get-appointment/:id").get(getAppointmentDetail);

//secured routes
router.route("/create-appointment").post(createAppointment);
router.route("/update-appointment/:id").put(updateAppointment);
router.route("/delete-appointment/:id").delete(deleteAppointment);

export default router
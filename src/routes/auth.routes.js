import { Router } from "express";
import {
    login,
    logout,
    registerAdmin,
} from "../controller/auth.controllers.js";

const router = Router();

//sercured routes
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/register-admin").post(registerAdmin);

export default router
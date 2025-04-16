import { Router } from "express";
import {
    login,
    logout,
    refreshAccessToken,
    registerAdmin,
} from "../controller/auth.controllers.js";
import { verifyJWT } from "../middelwares/auth.middlewares.js";

const router = Router();

//unsecured routes
router.route("/login").post(login);

//sercured routes

router.route("/logout").post(verifyJWT, logout);
router.route("/register-admin").post(verifyJWT, registerAdmin);
router.route("/refresh-access-token").post(verifyJWT, refreshAccessToken)

export default router
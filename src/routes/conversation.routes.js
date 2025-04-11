import { Router } from "express";
import {
    getConversationLogs,
    createConversation,
    getConversationById

} from "../controller/conversation.controllers.js";

const router = Router();

//unsecured routes
router.route("/get-conversations/:id").get(getConversationLogs);
router.route("/get-conversation/:id").get(getConversationById);

//secured routes
router.route("/create-conversation").post(createConversation);

export default router
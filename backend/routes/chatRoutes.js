import express from "express";
import { createChatMsg, getAllMsgsForProject, getChatForProject } from "../controllers/chatController.js";

const router = express.Router();

// Chat Routes

router.post("/", createChatMsg);
router.get("/msgs", getAllMsgsForProject);
router.get("/getchat", getChatForProject);

export default router;
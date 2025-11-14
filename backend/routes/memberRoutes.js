import express from "express";
import { createProjectMember, deleteProjectMember, getAllMembers, updateProjectMember } from "../controllers/memberController.js";

const router = express.Router();

// Member Routes

router.post("/", createProjectMember);
router.get("/get", getAllMembers);
router.put("/update", updateProjectMember);
router.delete("/delete", deleteProjectMember);

export default router;
import express from "express";
import { createProjectMember, deleteProjectMember, searchMembers, updateProjectMember } from "../controllers/memberController.js";
import { userAuthorize } from "../middlewares/userAuthorize.js";
import { adminAuthorize } from "../middlewares/adminAuthorize.js";

const router = express.Router();

router.post("/add/:project_id", userAuthorize, adminAuthorize, createProjectMember);
router.put("/update/:project_id", userAuthorize, adminAuthorize, updateProjectMember);
router.delete("/delete/:project_id", userAuthorize, adminAuthorize, deleteProjectMember);

router.get("/search/:project_id", userAuthorize, adminAuthorize, searchMembers);

export default router;
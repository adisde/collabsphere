import express from "express";
import { createProjectTask, deleteProjectTask, updateProjectTask, updateTaskStatus } from "../controllers/taskController.js";
import { userAuthorize } from "../middlewares/userAuthorize.js";
import { adminAuthorize } from "../middlewares/adminAuthorize.js";
import { projectAuthorize } from "../middlewares/projectAuthorize.js";

const router = express.Router();

router.post("/create/:project_id", userAuthorize, adminAuthorize, createProjectTask);
router.put("/update/:project_id", userAuthorize, adminAuthorize, updateProjectTask);
router.delete("/delete/:project_id", userAuthorize, adminAuthorize, deleteProjectTask);

router.put("/update-status/:project_id", userAuthorize, projectAuthorize, updateTaskStatus);

export default router;
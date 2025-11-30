import express from "express";
import { createNewProject, getAllProjectsForUser, getSingleProjectForUser, removeExistingProject, updateExistingProject } from "../controllers/projectController.js";
import { userAuthorize } from "../middlewares/userAuthorize.js";
import { adminAuthorize } from "../middlewares/adminAuthorize.js";
import { projectAuthorize } from "../middlewares/projectAuthorize.js";

const router = express.Router();

router.post("/create", userAuthorize, createNewProject);
router.put("/update/:project_id", userAuthorize, adminAuthorize, updateExistingProject);
router.delete("/delete/:project_id", userAuthorize, adminAuthorize, removeExistingProject);

router.get("/get-project/:project_id", userAuthorize, projectAuthorize, getSingleProjectForUser);
router.get("/get-all", userAuthorize, getAllProjectsForUser);

export default router;
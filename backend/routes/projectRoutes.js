import express from "express";
import { createNewProject, deleteExistProject, getProject, updateExistProject } from "../controllers/projectController.js";

const router = express.Router();

// Project Routes

router.post("/", createNewProject);
router.get("/get", getProject);
router.put("/update", updateExistProject);
router.delete("/delete", deleteExistProject);

export default router;
import express from "express";
import { createProjectTask, deleteProjectTask, updateProjectTask } from "../controllers/taskController.js";

const router = express.Router();

// Task Routes

router.post("/", createProjectTask);
router.put("/update", updateProjectTask);
router.delete("/delete", deleteProjectTask);

export default router;

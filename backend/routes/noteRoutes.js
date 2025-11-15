import express from "express";
import { createProjectNote, deleteProjectNote, getProjectNotes, updateProjectNote } from "../controllers/notesController.js";

const router = express.Router();

// Note Routes

router.post("/", createProjectNote);
router.get("/get", getProjectNotes);
router.put("/update", updateProjectNote);
router.delete("/delete", deleteProjectNote);

export default router;
import express from "express";
import { createProjectNote, deleteExistingProjectNote, getExistingProjectNote, updateExistingProjectNote } from "../controllers/notesController.js";
import { userAuthorize } from "../middlewares/userAuthorize.js";
import { projectAuthorize } from "../middlewares/projectAuthorize.js";

const router = express.Router();

router.post("/create/:project_id", userAuthorize, projectAuthorize, createProjectNote);
router.put("/update/:project_id", userAuthorize, projectAuthorize, updateExistingProjectNote);
router.delete("/delete/:project_id", userAuthorize, projectAuthorize, deleteExistingProjectNote);

router.get("/get-note/:project_id", userAuthorize, projectAuthorize, getExistingProjectNote);

export default router;
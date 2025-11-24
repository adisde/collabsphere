import { inputValidator } from "../helpers/inputsValidator.js";
import Log from "../models/logModel.js";
import Notes from "../models/notesModel.js";

export const createProjectNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const id = req.id;
    const user_id = req.user_id;

    const result = inputValidator(["title", "content"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    if (title.length <= 3) return res.status(400).json({ ok: false, message: "Note title must be longer than 3 characters." });

    const createNote = await Notes.createNote({ project_id: id, user_id, title, content });
    if (!createNote) return res.status(400).json({ ok: false, message: "Unable to create note." });

    await Log.createProjectLog({ user_id, project_id: id, log_message: `${user_id} created note(${createNote.id}) for the project.` });

    return res.status(201).json({ ok: true, message: "Note created." });
  } catch (err) {
    console.error("Create note error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const updateExistingProjectNote = async (req, res) => {
  try {
    const { id } = req.query;
    const { title, content } = req.body;
    const project_id = req.id;
    const user_id = req.user_id;

    const result = inputValidator(["title", "content"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    if (!id || id.trim().length === "") return res.status(400).json({ ok: false, message: "Note Id is required." });
    if (title.trim().length <= 3) return res.status(400).json({ ok: false, message: "Note title must be longer than 3 characters." });

    const isExistNoteForProject = await Notes.getNote({ id });
    if (!isExistNoteForProject) return res.status(404).json({ ok: false, message: "Note not found." });

    if (user_id !== isExistNoteForProject.user_id) return res.status(401).json({ ok: false, message: "Can't update someone's note." });
    if (project_id !== isExistNoteForProject.project_id) return res.status(400).json({ ok: false, message: "Unknown project." });

    const updateNote = await Notes.updateNote({ title, content, id });
    if (!updateNote) return res.status(400).json({ ok: false, message: "Unable to update note." });

    return res.status(200).json({ ok: true, message: "Note updated." });

  } catch (err) {
    console.error("Update note error : ", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const getExistingProjectNote = async (req, res) => {
  try {
    const id = req.id;
    const searchNotes = await Notes.getNotes({ project_id: id });

    if (searchNotes.length === 0) return res.status(200).json({ ok: true, message: "No notes found.", notes: searchNotes || [] });

    return res.status(200).json({ ok: true, message: `${searchNotes.length} Notes retrieved.`, notes: searchNotes });
  } catch (err) {
    console.error("Get Notes error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const deleteExistingProjectNote = async (req, res) => {
  try {
    const { id } = req.query;
    const user_id = req.user_id;
    const project_id = req.id;

    const result = inputValidator(["id"], req.query);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const getNote = await Notes.getNote({ id });
    if (!getNote) return res.status(404).json({ ok: false, message: "Note not found." });

    if (user_id !== getNote.user_id) return res.status(401).json({ ok: false, message: "Can't delete someone's note." });
    if (project_id !== getNote.project_id) return res.status(400).json({ ok: false, message: "Unknown project." });

    const deleteNote = await Notes.removeNote({ id });
    if (!deleteNote) return res.status(400).json({ ok: false, message: "Unable to delete note." });

    return res.status(200).json({ ok: true, message: "Note deleted." });
  } catch (err) {
    console.error("Delete note error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." })
  }
};

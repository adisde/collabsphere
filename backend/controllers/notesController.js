import Log from "../models/logModel.js";
import Member from "../models/memberModel.js";
import Notes from "../models/notesModel.js";
import Project from "../models/projectModel.js";

// Create project note

export const createProjectNote = async (req, res) => {
  try {
    const { user_id, project_id, title, content } = req.body;

    if (!user_id || !project_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        message: "Missing note information.",
      });
    }

    const isExistProject = await Project.searchProjectId({ project_id });

    if (!isExistProject) {
      return res.status(400).json({
        message: "Project does not exist.",
      });
    }

    const isExistMemberInProject = await Member.searchMember({
      user_id,
      project_id,
    });

    if (!isExistMemberInProject) {
      return res.status(400).json({
        message: "U're not a part of this project.",
      });
    }

    const createNote = await Notes.createNote({
      project_id,
      user_id,
      title,
      content,
    });

    if (!createNote) {
      return res.status(400).json({
        message: "Failed to create note.",
      });
    }

    await Log.createProjectLog({
      user_id,
      project_id,
      log_message: `${user_id} created a note ${createNote.id} in project ${project_id}.`,
    });
    return res.status(200).json({
      message: "Note has been created.",
    });
  } catch (err) {
    console.error("Creating note error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Updating existing project note

export const updateProjectNote = async (req, res) => {
  try {
    const { id } = req.query;
    const { user_id, project_id, title, content } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Invalid or missing note id.",
      });
    }

    if (!user_id || !project_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        message: "Missing note information.",
      });
    }

    const isExistProject = await Project.searchProjectId({ project_id });

    if (!isExistProject) {
      return res.status(400).json({
        message: "Project does not exist.",
      });
    }

    const isExistMemberInProject = await Member.searchMember({
      user_id,
      project_id,
    });

    if (!isExistMemberInProject) {
      return res.status(400).json({
        message: "U're not a part of this project.",
      });
    }

    const isExistNoteForProject = await Notes.getNote({ id });

    if (!isExistNoteForProject) {
      return res.status(400).json({
        message: "Current note does not exist for this project.",
      });
    }

    if (user_id !== isExistNoteForProject.user_id) {
      return res.status(400).json({
        message: "U can't update someone else note.",
      });
    }

    if (project_id !== isExistNoteForProject.project_id) {
      return res.status(400).json({
        message: "Invalid project id.",
      });
    }

    const updateNote = await Notes.updateNote({
      title,
      content,
      id,
    });

    if (!updateNote) {
      return res.status(400).json({
        message: "Failed to update this note.",
      });
    }

    await Log.createProjectLog({
      user_id,
      project_id,
      log_message: `${user_id} updated a note ${updateNote.id} in project ${project_id}.`,
    });

    return res.status(200).json({
      message: "Note has been updated.",
    });
  } catch (err) {
    console.error("Updating note error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Get notes for project

export const getProjectNotes = async (req, res) => {
  try {
    const { project_id } = req.query;

    if (!project_id) {
      return res.status(400).json({
        message: "Invalid or missing project id.",
      });
    }

    const isExistProject = await Project.searchProjectId({ project_id });

    if (!isExistProject) {
      return res.status(400).json({
        message: "Project does not exist.",
      });
    }

    const searchNotes = await Notes.getNotes({ project_id });

    if (searchNotes.length === 0) {
      return res.status(200).json({
        message: "No found notes for this project.",
        res: [],
      });
    }

    return res.status(200).json({
      message: "Search successful.",
      res: searchNotes,
    });
  } catch (err) {
    console.error("Getting Notes error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Deleting project note

export const deleteProjectNote = async (req, res) => {
  try {
    const { id } = req.query;
    const { user_id, project_id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Invalid or missing note id.",
      });
    }

    if (!user_id || !project_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    const isExistProject = await Project.searchProjectId({ project_id });

    if (!isExistProject) {
      return res.status(400).json({
        message: "Project does not exist.",
      });
    }

    const isExistMemberInProject = await Member.searchMember({
      user_id,
      project_id,
    });

    if (!isExistMemberInProject) {
      return res.status(400).json({
        message: "U're not a part of this project.",
      });
    }

    const isExistNoteForProject = await Notes.getNote({ id });

    if (!isExistNoteForProject) {
      return res.status(400).json({
        message: "This note does note exist for this project.",
      });
    }

    if (isExistNoteForProject.user_id !== user_id) {
      return res.status(400).json({
        message: "U can't delete someone else note.",
      });
    }

    if (project_id !== isExistNoteForProject.project_id) {
      return res.status(400).json({
        message: "Invalid project id.",
      });
    }

    const removeNote = await Notes.removeNote({ id });

    if (!removeNote) {
      return res.status(400).json({
        message: "Failed to delete note.",
      });
    }

    await Log.createProjectLog({
      user_id,
      project_id,
      log_message: `${user_id} deleted note ${id} in project ${project_id}.`,
    });

    return res.status(200).json({
      message: "Note has been deleted.",
    });
  } catch (err) {
    console.error("Deleting note error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

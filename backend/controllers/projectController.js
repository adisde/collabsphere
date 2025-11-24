import { inputValidator } from "../helpers/inputsValidator.js";
import Chat from "../models/chatModel.js";
import ChatMsg from "../models/chatMsgModel.js";
import Log from "../models/logModel.js";
import Member from "../models/memberModel.js";
import Notes from "../models/notesModel.js";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";

export const createNewProject = async (req, res) => {
  try {
    const { owner_id, title, description } = req.body;

    const result = inputValidator(["owner_id", "title", "description"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    if (title.length <= 3) return res.status(400).json({ ok: false, message: "Project title must be longer than 3 characters." });

    const newProject = await Project.createProject({ title, description, owner_id });
    if (!newProject) return res.status(400).json({ ok: false, message: "Failed to create project." });

    const newChatForProject = await Chat.createChat({ project_id: newProject.id, last_message: null });
    if (!newChatForProject) return res.status(400).json({ ok: false, message: "Failed to create chat room for project." });

    const createCurrentMember = await Member.createMember({ project_id: newProject.id, user_id: owner_id, role: "admin" });
    if (!createCurrentMember) return res.status(400).json({ ok: false, message: "Failed to create member for this project." });

    await Log.createProjectLog({ user_id: owner_id, project_id: newProject.id, log_message: "Project created." });

    return res.status(201).json({ ok: true, message: "Project created successfully.", chat_id: newChatForProject.id, project_id: newProject.id });

  } catch (err) {
    console.error("Create project error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const updateExistingProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.id;
    const user_id = req.user_id;

    const result = inputValidator(["title", "description"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    if (title.length <= 3) return res.status(400).json({ ok: false, message: "Project title must be longer than 3 characters." });

    const updateProject = await Project.updateProject({ title, description, id });
    if (!updateProject) return res.status(400).json({ ok: false, message: "Failed to update project details." });

    await Log.createProjectLog({ user_id, project_id: id, log_message: "Project updated successfully." });

    return res.status(200).json({ ok: true, message: "Project updated successfully." });
  } catch (err) {
    console.error("Update project error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const removeExistingProject = async (req, res) => {
  try {
    const id = req.id;

    const result = inputValidator(["id"], { id });
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const getChatForProject = await Chat.getChatForProject({ project_id: id });
    if (!getChatForProject) return res.status(404).json({ ok: false, message: "Chat doesn't exist for this project." });

    try {
      await Promise.all([
        Chat.deleteChatForProject({ id: getChatForProject.id }),
        Member.removeAllMembersForProject({ project_id: id }),
        Task.removeAllTasksForProject({ project_id: id }),
        Notes.removeAllNotesForProject({ project_id: id }),
        ChatMsg.removeAllMessageForProject({ chat_id: getChatForProject.id }),
      ]);
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Cleanup process failed." });
    }

    const removeProject = await Project.removeProject({ id });
    if (!removeProject) return res.status(400).json({ ok: false, message: "Failed to delete this project." });

    return res.status(200).json({ ok: true, message: "Project deleted successfully." });
  } catch (err) {
    console.error("Delete project error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const getAllProjectsForUser = async (req, res) => {
  try {
    const { user_id } = req.query;

    const result = inputValidator(["user_id"], req.query);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const isExistProject = await Project.searchAllProjectsForUser({ user_id });
    if (isExistProject.length === 0) return res.status(200).json({ ok: true, message: "No projects yet.", projects: isExistProject || [] });

    return res.status(200).json({ ok: true, message: `Found ${isExistProject.length} projects.`, projects: isExistProject });
  } catch (err) {
    console.error("Get all projects error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const getSingleProjectForUser = async (req, res) => {
  try {
    const id = req.id;

    const result = inputValidator(["id"], { id });
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const [project, members, tasks, notes, logs] = await Promise.all([
      Project.searchProjectById({ project_id: id }),
      Member.searchMembers({ project_id: id }),
      Task.getTasks({ project_id: id }),
      Notes.getNotes({ project_id: id }),
      Log.getProjectLogs({ project_id: id })
    ])

    return res.status(200).json({
      ok: true,
      project,
      members,
      tasks,
      notes,
      logs,
      message: "Successful.",
    });
  } catch (err) {
    console.error("Get single project error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

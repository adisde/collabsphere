import { inputValidator } from "../helpers/inputsValidator.js";
import Log from "../models/logModel.js";
import Member from "../models/memberModel.js";
import Task from "../models/taskModel.js";

export const createProjectTask = async (req, res) => {
  try {
    const { title, description, assigned_to, due_date, status } = req.body;

    const owner_id = req.user_id;
    const project_id = req.id;

    const result = inputValidator(["title", "assigned_to", "due_date", "status"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const isExistUserInProject = await Member.searchMember({ user_id: assigned_to, project_id });
    if (!isExistUserInProject) return res.status(400).json({ ok: false, message: "User does not exist." });

    if (title.trim().length <= 3) return res.status(400).json({ ok: false, message: "Task title length must be longer than 3 characters." });

    const validStatus = ["todo", "inprogress", "completed"];
    if (!validStatus.includes(status.trim())) return res.status(400).json({ ok: false, message: "Invalid status." });

    const createNewTask = await Task.createTask({ assigned_to, project_id, title, description, status, due_date });
    if (!createNewTask) return res.status(400).json({ ok: false, message: "Unable to create task." });

    await Log.createProjectLog({ user_id: owner_id, project_id, log_message: `${owner_id} assgined task to ${assigned_to}.` });

    return res.status(201).json({ ok: true, message: "Task created and assigned.", task: createNewTask});
  } catch (err) {
    console.error("Create task error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const updateProjectTask = async (req, res) => {
  try {
    const { title, description, assigned_to, due_date, status } = req.body;

    const owner_id = req.user_id;
    const project_id = req.id;
    const id = req.query.task_id;

    const result = inputValidator(["title", "assigned_to", "due_date", "status"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    if (title.trim().length <= 3) return res.status(400).json({ ok: false, message: "Task title length must be longer than 3 characters." });

    const validStatus = ["todo", "inprogress", "completed"];
    if (!validStatus.includes(status.trim())) return res.status(400).json({ ok: false, message: "Invalid status." });

    const isExistUserInProject = await Member.searchMember({ user_id: assigned_to, project_id });
    if (!isExistUserInProject) return res.status(400).json({ ok: false, message: "User does not exist" });

    const isExistTask = await Task.getSingleTask({ id });
    if (!isExistTask) return res.status(404).json({ ok: false, message: "Task not found." });

    const updateExistTask = await Task.updateTask({ assigned_to, id, title, description, status, due_date });
    if (!updateExistTask) return res.status(400).json({ ok: false, message: "Unable to update task." });

    if (updateExistTask.assigned_to !== assigned_to) {
      await Log.createProjectLog({ user_id: owner_id, project_id, log_message: `${owner_id} assigned task to ${assigned_to}.` });
    }

    await Log.createProjectLog({ user_id: owner_id, project_id, log_message: `${owner_id} updated task details.` });
    return res.status(200).json({ ok: true, message: "Task updated.", task: updateExistTask});
  } catch (err) {
    console.error("Update task error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const deleteProjectTask = async (req, res) => {
  try {
    const id = req.query.id;
    const owner_id = req.user_id;
    const project_id = req.id;

    if (!id) return res.status(400).json({ ok: false, message: "Task id is required." });

    const isExistTask = await Task.getSingleTask({ id });
    if (!isExistTask) return req.status(404).json({ ok: false, message: "Task not found." });

    const deleteTask = await Task.removeTask({ id });
    if (!deleteTask) return res.status(400).json({ ok: false, message: "Unable to create task." });

    await Log.createProjectLog({ user_id: owner_id, project_id, log_message: `${owner_id} deleted task${id}.` });
    return res.status(200).json({ ok: true, message: "Task deleted." });
  } catch (err) {
    console.error("Delete task error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const id = req.query.task_id;
    const { status } = req.body;
    const user_id = req.user_id;
    const project_id = req.project_id;

    const result = inputValidator(["status"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const validStatus = ["todo", "inprogress", "completed"];
    if (!validStatus.includes(status.trim())) return res.status(400).json({ ok: false, message: "Invalid status." });

    if (!id) return res.status(400).json({ ok: false, message: "Task id is required." });

    const isExistUserInForTask = await Task.getSingleTask({ id });
    if (!isExistUserInForTask) return res.status(404).json({ ok: false, message: "Task not found." });
    if (isExistUserInForTask.assigned_to !== user_id) return res.status(400).json({ ok: false, message: "Can't update someone's task." });

    const updateTask = await Task.updateStatus({ id, status });
    if (!updateTask) return res.status(400).json({ ok: false, message: "Unable to update task." });

    await Log.createProjectLog({ user_id, project_id, log_message: `${user_id} update task status to ${status}.` });
    return res.status(200).json({ ok: true, message: "Task status updated." });
  } catch (err) {
    console.error("Update task status error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
}
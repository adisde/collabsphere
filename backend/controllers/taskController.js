import Log from "../models/logModel.js";
import Member from "../models/memberModel.js";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";

// Creating project task

export const createProjectTask = async (req, res) => {
  try {
    const { project_id, title, description, assigned_to, due_date, status } =
      req.body;

    const { owner_id } = req.query;

    if (!project_id || !owner_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    if (!title || !assigned_to || !due_date || !status) {
      return res.status(400).json({
        message: "Missing task information.",
      });
    }

    const isExistProject = await Project.searchProjectId({ project_id });

    if (!isExistProject) {
      return res.status(400).json({
        message: "Project does not exist.",
      });
    }

    const isExistOwner = await Member.searchMember({
      user_id: owner_id,
      project_id,
    });

    if (!isExistOwner) {
      return res.status(400).json({
        message: "U're not a part of this project.",
      });
    }

    if (isExistOwner.role !== "admin") {
      return res.status(400).json({
        message: "U can't add tasks to this project.",
      });
    }

    const isExistAssginee = await Member.searchMember({
      user_id: assigned_to,
      project_id,
    });

    if (!isExistAssginee) {
      return res.status(400).json({
        message: "This user not exist in the project.",
      });
    }

    const createPrTask = await Task.createTask({
      assigned_to,
      project_id,
      title,
      description,
      status,
      due_date,
    });

    if (!createPrTask) {
      return res.status(400).json({
        message: "Failed to create task.",
      });
    }

    await Log.createProjectLog({
      user_id: owner_id,
      project_id,
      log_message: `${owner_id} assigned a task to ${assigned_to}`,
    });

    return res.status(200).json({
      message: "Task has been created.",
    });
  } catch (err) {
    console.error("Creating task error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Update Existing Task

export const updateProjectTask = async (req, res) => {
  try {
    const { id } = req.query;
    const {
      title,
      description,
      due_date,
      status,
      assigned_to,
      user_id,
      project_id,
    } = req.body;

    if (!id || !user_id || !project_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    if (!title || !due_date || !status) {
      return res.status(400).json({
        message: "Missing task information.",
      });
    }

    const isExistProject = await Project.searchProjectId({ project_id });

    if (!isExistProject) {
      return res.status(400).json({
        message: "Project does not exist.",
      });
    }

    const isExistUserInProject = await Member.searchMember({
      user_id,
      project_id,
    });

    if (!isExistUserInProject) {
      return res.status(400).json({
        message: "This user does not exist for this project.",
      });
    }

    const isExistTask = await Task.getSingleTask({ id });

    if (!isExistTask) {
      return res.status(400).json({
        message: "Task does not exist.",
      });
    }

    if (project_id !== isExistProject.id) {
      return res.status(400).json({
        message: "Task does not exist in project.",
      });
    }

    if (
      isExistUserInProject.role !== "admin" &&
      isExistTask.assigned_to !== user_id
    ) {
      return res.status(403).json({
        message: "U can't update this task.",
      });
    }

    if (
      isExistUserInProject.role !== "admin" &&
      assigned_to !== isExistTask.assigned_to
    ) {
      return res.status(403).json({
        message: "Only admins can reassign tasks.",
      });
    }

    const updatePrTask = await Task.updateTask({
      assigned_to,
      id,
      title,
      description,
      status,
      due_date,
    });

    if (!updatePrTask) {
      return res.status(400).json({
        message: "Failed to update the task.",
      });
    }

    await Log.createProjectLog({
      user_id,
      project_id,
      log_message: `${user_id} updated the task.`,
    });

    return res.status(200).json({
      message: "Task has been updated.",
    });
  } catch (err) {
    console.error("Updating task error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Deleting the task

export const deleteProjectTask = async (req, res) => {
  try {
    const { id } = req.query;
    const { user_id, project_id } = req.body;

    if (!id || !user_id || !project_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    const isExistTaskForProject = await Task.getSingleTask({ id });

    if (!isExistTaskForProject) {
      return res.status(400).json({
        message: "Task does not exist for this project.",
      });
    }

    if (isExistTaskForProject.project_id !== project_id) {
      return res.status(200).json({
        message: "This task does not belong to this project.",
      });
    }

    const isExistProject = await Project.searchProjectId({ project_id });

    if (!isExistProject) {
      return res.status(400).json({
        message: "Project does not exist.",
      });
    }

    const isExistOwner = await Member.searchMember({
      user_id,
      project_id,
    });

    if (!isExistOwner) {
      return res.status(400).json({
        message: "U're not a part of this project.",
      });
    }

    if (isExistOwner.role !== "admin") {
      return res.status(400).json({
        message: "U can't delete this task.",
      });
    }

    const deletePrTask = await Task.removeTask({ id });

    if (!deletePrTask) {
      return res.status(400).json({
        message: "Failed to delete task.",
      });
    }

    await Log.createProjectLog({
      user_id,
      project_id,
      log_message: `${user_id} deleted a task ${id}.`,
    });

    return res.status(200).json({
      message: "Task has been deleted for this project.",
    });
  } catch (err) {
    console.error("Deleting task error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

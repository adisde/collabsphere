import Log from "../models/logModel.js";
import Project from "../models/projectModel.js";

// Creating project

export const createNewProject = async (req, res) => {
  try {
    const { owner_id, title, description } = req.body;

    if (!owner_id || !title || !description) {
      return res.status(400).json({
        message: "Invalid or missing information.",
      });
    }

    if (title.length <= 3) {
      return res.status(400).json({
        message: "Project title length must be greater than 3 characters.",
      });
    }

    const newProject = await Project.createProject({
      title: title,
      description: description,
      owner_id: owner_id,
    });

    if (!newProject) {
      return res.status(400).json({
        message: "Failed to create new project.",
      });
    }

    await Log.createProjectLog({
      owner_id: owner_id,
      project_id: newProject.id,
      log_message: "Project has been created.",
    });

    return res.status(200).json({
      message: "New project has been created.",
    });
  } catch (err) {
    console.error("Creating project error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Updating project

export const updateExistProject = async (req, res) => {
  try {
    const { title, description, owner_id } = req.body;
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: "Invalid or missing project id.",
      });
    }

    if (!title || !description || !owner_id) {
      return res.status(400).json({
        message: "Invalid or missing project details.",
      });
    }

    const isExistProject = await Project.searchProject({ user_id: owner_id });

    if (!isExistProject) {
      return res.status(400).json({
        message:
          "Projects does not exist for u, create new one to get started.",
      });
    }

    const updatePr = await Project.updateProject({
      title: title,
      description: description,
      owner_id: owner_id,
      id: id
    });

    if (!updatePr) {
      return res.status(400).json({
        message: "Failed to update project.",
      });
    }

    await Log.createProjectLog({
      user_id: owner_id,
      project_id: isExistProject.id,
      log_message: "Project details has been updated.",
    });

    return res.status(200).json({
      message: "Project details has been updated.",
    });
  } catch (err) {
    console.error("Updating project error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Deleting project

export const deleteExistProject = async (req, res) => {
  try {
    const { id, user_id } = req.query;

    if (!id || !user_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    const isExistProject = await Project.searchProject({ user_id: user_id });

    if (!isExistProject) {
      return res.status(400).json({
        message: "Project does not exist for u, create new one to get started.",
      });
    }

    const remProject = await Project.removeProject({ id: id });

    if (!remProject) {
      return res.status(400).json({
        message: "Failed to delete project.",
      });
    }
    
    return res.status(200).json({
      message: "Project has been deleted.",
    });
  } catch (err) {
    console.error("Deleting project error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Get project for user

export const getProject = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        message: "Invalid or missing user id.",
      });
    }

    const isExistProjectForUser = await Project.searchProject({
      user_id: user_id,
    });

    if (!isExistProjectForUser) {
      return res.status(400).json({
        message: "Project does not exist for u, create new one to get started.",
      });
    }

    return res.status(200).json({
      message: "Search successful.",
      res: isExistProjectForUser,
    });
  } catch (err) {
    console.error("Searching project error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

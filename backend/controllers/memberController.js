import Log from "../models/logModel.js";
import Member from "../models/memberModel.js";
import Project from "../models/projectModel.js";

// Creating project member

export const createProjectMember = async (req, res) => {
  try {
    const { user_id, project_id, role } = req.body;
    const { owner_id } = req.query;

    if (!user_id || !project_id || !owner_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    if (!role) {
      return res.status(200).json({
        message: "Invalid or missing member role.",
      });
    }

    const isExistMember = await Member.searchMember({
      user_id: user_id,
      project_id: project_id,
    });

    if (isExistMember) {
      return res.status(400).json({
        message: "You're already exist in this project.",
      });
    }

    const createMemberProject = await Member.createMember({
      project_id: project_id,
      user_id: user_id,
      role: role,
    });

    if (!createMemberProject) {
      return res.status(400).json({
        message: "Failed to add this member for this project.",
      });
    }

    await Log.createProjectLog({
      user_id: owner_id,
      project_id: project_id,
      log_message: `${owner_id} added user ${user_id}`,
    });

    return res.status(200).json({
      message: "Member has been added.",
    });
  } catch (err) {
    console.error("Creating member error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Updating project member

export const updateProjectMember = async (req, res) => {
  try {
    const { owner_id } = req.query;
    const { role, user_id, project_id } = req.body;
    console.log(req.body);

    if (!project_id || !user_id) {
      return res.status(400).json({
        message: "Invaild or missing ids.",
      });
    }

    if (!role) {
      return res.status(400).json({
        message: "Missing member role.",
      });
    }

    const isExistProject = await Project.searchProjectId({
      project_id: project_id,
    });

    if (!isExistProject) {
      return res.status(400).json({
        message: "Project does not exist.",
      });
    }

    const updateMemberPr = await Member.updateMember({
      role: role,
      user_id: user_id,
      project_id: project_id,
    });

    if (!updateMemberPr) {
      return res.status(400).json({
        message: "Failed to update the member role.",
      });
    }

    await Log.createProjectLog({
      user_id: owner_id,
      project_id: project_id,
      log_message: `${owner_id} updated the role as ${role} of user ${user_id}`,
    });

    return res.status(200).json({
      message: "Member has been updated.",
    });
  } catch (err) {
    console.error("Updating member error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Get all members for project

export const getAllMembers = async (req, res) => {
  try {
    const { project_id } = req.query;

    if (!project_id) {
      return res.status(400).json({
        message: "Invalid or missing project id",
      });
    }

    const searchMembers = await Member.searchMembers({
      project_id: project_id,
    });

    if (!searchMembers || searchMembers.length === 0) {
      return res.status(400).json({
        message: "Members does not exist for this project.",
      });
    }

    return res.status(200).json({
      message: "Search successful.",
      res: searchMembers,
    });
  } catch (err) {
    console.error("Getting members error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Delete project member

export const deleteProjectMember = async (req, res) => {
  try {
    const { owner_id } = req.query;
    const { project_id, user_id } = req.body;
    
    if (!project_id || !user_id || !owner_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    const isExistProjectForUser = await Member.searchMember({
      user_id: user_id,
      project_id: project_id,
    });

    if (!isExistProjectForUser) {
      return res.status(400).json({
        message: "Current member does not exist in this project.",
      });
    }

    const removeProjectMem = await Member.removeMember({
      user_id: user_id,
      project_id: project_id,
    });

    if (!removeProjectMem) {
      return res.status(400).json({
        message: "Failed to remove member.",
      });
    }

    await Log.createProjectLog({
      user_id: owner_id,
      project_id: project_id,
      log_message: `${owner_id} removed user ${user_id}`,
    });

    return res.status(200).json({
      message: "Member has been removed.",
    });
  } catch (err) {
    console.error("Deleting member error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

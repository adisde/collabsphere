import Member from "../models/memberModel.js";
import Project from "../models/projectModel.js";

export const projectAuthorize = async (req, res, next) => {
  try {
    const user_id = req.body.user_id;
    const project_id = req.body.project_id;

    if (!user_id || !project_id) {
      return res.status(400).json({
        message: "User ID and Project ID are required.",
      });
    }

    const isExistProject = await Project.searchProjectId({ project_id });

    if (!isExistProject) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const isExistMemberForProject = await Member.searchMember({
      user_id,
      project_id,
    });

    if (!isExistMemberForProject) {
      return res.status(403).json({
        message: "Access denied. User is not a member of this project.",
      });
    }

    if (!isExistMemberForProject.role) {
      return res.status(400).json({
        message: "Invalid member role.",
      });
    }

    next();
  } catch (err) {
    return res.status(400).json({
      message: `Authorization failed: ${err.message}`,
    });
  }
};

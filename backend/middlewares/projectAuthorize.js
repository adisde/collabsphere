import Member from "../models/memberModel.js";
import Project from "../models/projectModel.js";

export const projectAuthorize = async (user_id, project_id) => {
  try {
    if (!user_id || !project_id) {
      return {
        message: "User ID and Project ID are required.",
        isTrue: false,
      };
    }

    const isExistProject = await Project.searchProjectId({ project_id });

    if (!isExistProject) {
      return {
        message: "Project not found.",
        isTrue: false,
      };
    }

    const isExistMemberForProject = await Member.searchMember({
      user_id,
      project_id,
    });

    if (!isExistMemberForProject) {
      return {
        message: "Access denied. User is not a member of this project.",
        isTrue: false,
      };
    }

    if (!isExistMemberForProject.role) {
      return {
        message: "Invalid member role.",
        isTrue: false,
      };
    }

    return {
      message: "Access granted.",
      isTrue: true,
    };
  } catch (err) {
    return {
      message: `Authorization failed: ${err.message}`,
      isTrue: false,
    };
  }
};

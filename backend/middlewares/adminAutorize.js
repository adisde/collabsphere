import Member from "../models/memberModel.js";
import Project from "../models/projectModel.js";

export const adminAuthorize = async (user_id, project_id) => {
  try {
    if (!user_id || !project_id) {
      return {
        message: "User Id and Project Id are required.",
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

    const isExistMemberAdmin = isExistMemberForProject.role === "admin";

    if (!isExistMemberAdmin) {
      return {
        message: "Admin privileges required.",
        isTrue: false,
      };
    }

    return {
      message: "Admin access granted.",
      isTrue: true,
    };
  } catch (err) {
    return {
      message: `Authorization failed: ${err.message}`,
      isTrue: false,
    };
  }
};

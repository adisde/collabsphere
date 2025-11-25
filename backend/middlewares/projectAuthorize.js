import { inputValidator } from "../helpers/inputsValidator.js";
import Member from "../models/memberModel.js";
import Project from "../models/projectModel.js";

export const projectAuthorize = async (req, res, next) => {
  try {
    const project_id = req.params.project_id;
    const user_id = req.user_id;

    const result = inputValidator(["project_id"], { project_id });
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    if (!user_id || user_id.trim() === "") return res.status(401).json({ ok: false, message: "Unauthorized." });

    const isExistProject = await Project.searchProjectById({ project_id });
    if (!isExistProject) return res.status(404).json({ ok: false, message: "Project not found." });

    const isExistMemberForProject = await Member.searchMember({ user_id, project_id });
    if (!isExistMemberForProject) return res.status(401).json({ ok: false, message: "Access denied, You're not a member of this project." });

    if (!isExistMemberForProject.role || isExistMemberForProject.role === "") return res.status(403).json({ ok: false, message: "Invalid role." });

    req.id = project_id;
    req.user_id = user_id;
    next();
  } catch (err) {
    console.error("Project user validation error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

import { inputValidator } from "../helpers/inputsValidator.js";
import Log from "../models/logModel.js";
import Member from "../models/memberModel.js";

export const createProjectMember = async (req, res) => {
  try {
    const { user_id, role } = req.body;
    const owner_id = req.user_id;
    const project_id = req.id;

    const result = inputValidator(["user_id", "role"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

   const adminMember = await Member.searchMember({user_id: owner_id, project_id});
   if (!adminMember || adminMember.role !== "admin") return res.status(403).json({ok: false, message: "Unauthorized."});

    const isExistMember = await Member.searchMember({ user_id, project_id });
    if (isExistMember) return res.status(200).json({ ok: true, message: "User exists in this project." });

    if (role.trim() !== "member") return res.status(400).json({ ok: false, message: "Can't add this user with this role" });

    const createMember = await Member.createMember({ project_id, user_id, role: role.trim() });
    if (!createMember) return res.status(400).json({ ok: false, message: "Unable to add this user." });

    await Log.createProjectLog({user_id: owner_id, project_id, log_message: `${owner_id} added ${user_id}.`})

    return res.status(200).json({ ok: true, message: "Member added." });
  } catch (err) {
    console.error("Create member error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const updateProjectMember = async (req, res) => {
  try {
    const owner_id = req.user_id;
    const project_id = req.id;
    const { role, user_id } = req.body;

    const result = inputValidator(["role", "user_id"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

   const adminMember = await Member.searchMember({user_id: owner_id, project_id});
   if (!adminMember || adminMember.role.trim() !== "admin") return res.status(403).json({ok: false, message: "Unauthorized."});

    const isExistMember = await Member.searchMember({ user_id, project_id });
    if (!isExistMember) return res.status(400).json({ ok: false, message: "Unknown user." });

    if (owner_id === user_id) return res.status(400).json({ ok: false, message: "You can't update yourself." });

    if (role.trim() !== "member" && role.trim() !== "admin") return res.status(400).json({ok: false, message: "Invalid role."});

    const updateMember = await Member.updateMember({ role, user_id, project_id });
    if (!updateMember) return res.status(400).json({ ok: false, message: "Unable to update member." });
    
    await Log.createProjectLog({user_id: owner_id, project_id, log_message: `${owner_id} updated ${user_id} to ${role}`})

    return res.status(200).json({ ok: true, message: "Member updated." });
  } catch (err) {
    console.error("Update member error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const deleteProjectMember = async (req, res) => {
  try {
    const owner_id = req.user_id;
    const project_id = req.id;
    const { user_id } = req.query;

    const result = inputValidator(["user_id"], req.query);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const adminMember = await Member.searchMember({user_id: owner_id, project_id});
   if (!adminMember || adminMember.role.trim() !== "admin") return res.status(403).json({ok: false, message: "Unauthorized."});

    const isExistMember = await Member.searchMember({ user_id, project_id });
    if (!isExistMember) return res.status(400).json({ ok: false, message: "Unknown user." });

    if (isExistMember.role !== "member") return res.status(400).json({ok: false, message: "Can't delete this user."});

    if (owner_id === user_id) return res.status(400).json({ ok: false, message: "You can't delete yourself." });

    const deleteMember = await Member.removeMember({ user_id, project_id });
    if (!deleteMember) return res.status(400).json({ ok: false, message: "Unable to remove the user." });

    await Log.createProjectLog({user_id: owner_id, project_id, log_message: `${owner_id} removed ${user_id}.`});

    return res.status(200).json({ ok: true, message: "Member removed." });
  } catch (err) {
    console.error("Delete member error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};
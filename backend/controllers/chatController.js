import { inputValidator } from "../helpers/inputsValidator.js";
import Chat from "../models/chatModel.js";
import ChatMsg from "../models/chatMsgModel.js";
import Member from "../models/memberModel.js";

export const createChatMsgForProject = async (req, res) => {
  try {
    const { chat_id, message } = req.body;
    const id = req.id;
    const user_id = req.user_id;

    const result = inputValidator(["chat_id", "message"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const isExistChat = await Chat.getChat({ chat_id });
    if (!isExistChat) return res.status(400).json({ ok: false, message: "Chat doesn't exist." });

    const isExistMemberForChat = await Member.searchMember({ user_id, project_id: id });
    if (!isExistMemberForChat) return res.status(401).json({ ok: false, message: "Can't send message in this chat." });

    const bothMatchesProject = id === isExistChat.project_id;
    if (!bothMatchesProject) return res.status(401).json({ ok: false, message: "Unauthorized." });

    const createMsg = await ChatMsg.createChatMsg({ chat_id, sender_id: user_id, message });
    if (!createMsg) return res.status(400).json({ ok: false, message: "Unable to send message." });

    await Chat.updateChat({ chat_id, last_message: message }).catch(() => null);

    return res.status(200).json({ ok: true, message: "Message sent." });

  } catch (err) {
    console.error("Create chat message error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const getAllMsgsForProject = async (req, res) => {
  try {
    const { chat_id } = req.query;
    const project_id = req.id;
    const user_id = req.user_id;

    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const result = inputValidator(["chat_id"], req.query);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const isExistChat = await Chat.getChat({ chat_id });
    if (!isExistChat) return res.status(400).json({ ok: false, message: "Chat doesn't exist." });

    const isExistMemberForChat = await Member.searchMember({ user_id, project_id });
    if (!isExistMemberForChat) return res.status(401).json({ ok: false, message: "Unauthorized." });

    const bothMatchesProject = project_id === isExistChat.project_id;
    if (!bothMatchesProject) return res.status(401).json({ ok: false, message: "Unauthorized." });

    const getAllMsgs = await ChatMsg.getMsgs({ chat_id, limit, offset });
    const totalCount = await ChatMsg.getAllMsgsCount({ chat_id });

    if (getAllMsgs.length === 0) return res.status(200).json({ ok: true, message: "No messages.", msgs: [] });

    return res.status(200).json({ ok: true, message: "Messages found.", msgs: getAllMsgs, pagination: { total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) } });
  } catch (err) {
    console.error("Get chat messages error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

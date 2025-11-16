import ChatMembers from "../models/chatMembers.js";
import Chat from "../models/chatModel.js";
import ChatMsg from "../models/chatMsgModel.js";
import Project from "../models/projectModel.js";

// Creating chat message

export const createChatMsg = async (req, res) => {
  try {
    const { chat_id, sender_id, message, sent_at, project_id } = req.body;

    if (!chat_id || !sender_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    if (!message) {
      return res.status(400).json({
        message: "Message can't be empty.",
      });
    }

    const isExistChat = await Chat.getChat({ chat_id });

    if (!isExistChat) {
      return res.status(400).json({
        message: "Chat does not exist for this project.",
      });
    }

    const isExistUserInChat = await ChatMembers.getMember({
      user_id: sender_id,
      project_id,
    });

    if (!isExistUserInChat) {
      return res.status(400).json({
        message: "U're not a part of this chat.",
      });
    }

    const createMsg = await ChatMsg.createChatMsg({
      chat_id,
      sender_id,
      message,
      sent_at: sent_at || new Date(),
    });

    if (!createMsg) {
      return res.status(400).json({
        message: "Failed to send message.",
      });
    }

    const updateChat = await Chat.updateChat({
      chat_id,
      last_message: message,
      last_updated_at: sent_at || new Date(),
    });

    if (!updateChat) {
      return res.status(400).json({
        message: "Failed to update chat message.",
      });
    }

    return res.status(200).json({
      message: "Message sent.",
      res: createMsg,
    });
  } catch (err) {
    console.error("Creating chat message error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Get single chat for project

export const getChatForProject = async (req, res) => {
  try {
    const { project_id, user_id } = req.query;

    if (!project_id || !user_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    const isExistProject = await Project.searchProjectId({ project_id });

    const isExistMemberForChat = await ChatMembers.getMember({user_id, project_id});

    if (!isExistMemberForChat) {
      return res.status(400).json({
        message: "U're not a part of this project."
      })
    }

    if (!isExistProject) {
      return res.status(400).json({
        message: "Project does not exist.",
      });
    }

    const isExistChat = await Chat.getChatProjectId({ project_id });

    if (!isExistChat) {
      return res.status(400).json({
        message: "Chat doesn't exist for this project.",
      });
    }

    return res.status(200).json({
      message: "Successful.",
      res: isExistChat,
    });
  } catch (err) {
    console.error("Getting chat error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Get all chat messages

export const getAllMsgsForProject = async (req, res) => {
  try {
    const { chat_id, project_id, user_id } = req.query;

    if (!chat_id || !user_id || !project_id) {
      return res.status(400).json({
        message: "Invalid or missing ids.",
      });
    }

    const isExistChat = await Chat.getChat({ chat_id });

    const isExistMemberForChat = await ChatMembers.getMember({user_id, project_id});

    if (!isExistMemberForChat) {
      return res.status(400).json({
        message: "U're not a part of this project."
      })
    }

    if (!isExistChat) {
      return res.status(400).json({
        message: "Chat does not exist.",
      });
    }

    const getMsgs = await ChatMsg.getMsgs({ chat_id });

    if (getMsgs.length === 0) {
      return res.status(200).json({
        message: "No message yet.",
        msg: getMsgs || [],
      });
    }

    return res.status(200).json({
      message: "Successful.",
      msg: getMsgs,
    });
  } catch (err) {
    console.error("Getting chat messages error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

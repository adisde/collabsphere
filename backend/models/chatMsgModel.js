import pool from "../config/db.js";

export default class ChatMsg {
    // Create Chat Message

    static async createChatMsg({ chat_id, sender_id, message, sent_at }) {
        const query = "INSERT INTO chat_msg (chat_id, sender_id, message, sent_at) VALUES ($1, $2, $3, $4) RETURNING *;";
        const { rows } = await pool.query(query, [chat_id, sender_id, message, sent_at]);
        return rows[0];
    }

    // Get Messages

    static async getMsgs({ chat_id }) {
        const query = "SELECT * FROM chat_msg WHERE chat_id = $1;";
        const { rows } = await pool.query(query, [chat_id]);
        return rows[0];
    }
}
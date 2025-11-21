import pool from "../config/db.js";

export default class ChatMsg {
    static async createChatMsg({ chat_id, sender_id, message }) {
        const query = `
            INSERT INTO chat_msg (chat_id, sender_id, message, sent_at) 
            VALUES ($1, $2, $3, NOW()) 
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [chat_id, sender_id, message]);
        return rows[0];
    }

    static async getMsgs({ chat_id }) {
        const query = `
            SELECT * FROM chat_msg 
            WHERE chat_id = $1 
            ORDER BY sent_at ASC 
            LIMIT 50;
        `;
        const { rows } = await pool.query(query, [chat_id]);
        return rows;
    }
}

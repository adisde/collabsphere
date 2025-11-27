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

  static async getMsgs({ chat_id, limit, offset }) {
    const query = `
            SELECT * FROM chat_msg 
            WHERE chat_id = $1 
            ORDER BY sent_at ASC 
            LIMIT $2 OFFSET $3;   
        `;
    const { rows } = await pool.query(query, [chat_id, limit, offset]);
    return rows;
  }

  static async getAllMsgsCount({ chat_id }) {
    const query = `
            SELECT COUNT(*) FROM chat_msg 
            WHERE chat_id = $1;
        `;
    const { rows } = await pool.query(query, [chat_id]);
    return parseInt(rows[0].count);
  }

  static async removeAllMessageForProject({ chat_id }) {
    const query = `DELETE FROM chat_msg WHERE chat_id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [chat_id]);
    return rows.length;
  }
}

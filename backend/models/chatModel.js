import pool from "../config/db.js";

export default class Chat {
  static async createChat({ project_id, last_message }) {
    const query =
      "INSERT INTO chats (project_id, last_message, last_updated_at) VALUES ($1, $2, NOW()) RETURNING *;";
    const { rows } = await pool.query(query, [project_id, last_message]);
    return rows[0];
  }

  static async updateChat({ chat_id, last_message }) {
    const query =
      "UPDATE chats SET last_message = $2, last_updated_at = NOW() WHERE id = $1 RETURNING *;";
    const { rows } = await pool.query(query, [
      chat_id,
      last_message,
    ]);
    return rows[0];
  }

  static async getChat({ chat_id }) {
    const query = "SELECT * FROM chats WHERE id = $1;";
    const { rows } = await pool.query(query, [chat_id]);
    return rows[0];
  }

  static async getChatForProject({ project_id }) {
    const query = "SELECT * FROM chats WHERE project_id = $1;";
    const { rows } = await pool.query(query, [project_id]);
    return rows[0];
  }

  static async deleteChatForProject({ id }) {
    const query = "DELETE FROM chats WHERE id = $1 RETURNING *;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

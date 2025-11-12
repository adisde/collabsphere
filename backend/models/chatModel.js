import pool from "../config/db.js";

export default class Chat {
    // Create Chat 

    static async createChat({ project_id, last_message }) {
        const query = "INSERT INTO chats (project_id, last_message) VALUES ($1, $2) RETURNING *;";
        const { rows } = await pool.query(query, [project_id, last_message]);
        return rows[0];
    }

    // Update Chat

    static async updateChat({ project_id, last_message, last_updated_at }) {
        const query = "UPDATE chats SET last_message = $2, last_updated_at = $3 WHERE project_id = $1 RETURNING *;";
        const { rows } = await pool.query(query, [project_id, last_message, last_updated_at]);
        return rows[0];
    }

    // Get Chat

    static async getChat({project_id}) {
        const query = "SELECT * FROM chats WHERE project_id = $1;";
        const {rows} = await pool.query(query, [project_id]);
        return rows;
    }

}
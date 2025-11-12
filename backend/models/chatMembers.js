import pool from "../config/db.js";

export default class ChatMembers {
    // Create Member

    static async createChatMember({ project_id, user_id, chat_id }) {
        const query = "INSERT INTO chat_members (project_id, user_id, chat_id) VALUES ($1, $2, $3) RETURNING *;";
        const { rows } = await pool.query(query, [project_id, user_id, chat_id]);
        return rows[0];
    }

    // Get Members 

    static async getMembers({project_id}) {
        const query = "SELECT * FROM chat_members WHERE project_id = $1;";
        const {rows} = await pool.query(query, [project_id]);
        return rows;
    }
}
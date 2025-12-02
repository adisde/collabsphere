import pool from "../config/db.js";

export default class Log {

    static async createProjectLog({ user_id, project_id, log_message }) {
        const query = 'INSERT INTO project_logs (user_id, project_id, log_message) VALUES ($1, $2, $3) RETURNING *;';
        const { rows } = await pool.query(query, [user_id, project_id, log_message]);
        return rows[0];
    }

    static async getProjectLogs({ project_id, limit = 20, offset = 0 }) {
        const query = "SELECT * FROM project_logs WHERE project_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;";
        const { rows } = await pool.query(query, [project_id, limit, offset]);
        return rows;
    }

    static async createUserLog({ user_id, log_message }) {
        const query = "INSERT INTO user_logs (user_id, log_message) VALUES ($1, $2) RETURNING *;";
        const { rows } = await pool.query(query, [user_id, log_message]);
        return rows[0];
    }

    static async getUserLogs({ user_id, limit = 20, offset = 0 }) {
        const query = "SELECT * FROM user_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;";
        const { rows } = await pool.query(query, [user_id, limit, offset]);
        return rows;
    }

    static async removeAllLogsForProject({ project_id }) {
        const query = `DELETE FROM project_logs WHERE project_id = $1 RETURNING *;`;
        const { rows } = await pool.query(query, [project_id]);
        return rows.length;
    }
}
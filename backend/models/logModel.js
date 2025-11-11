import pool from "../config/db.js";


export default class Log {
    // Create Project Log

    static async createProjectLog({ user_id, project_id, log_message }) {
        const query = 'INSERT INTO project_logs (user_id, project_id, log_message) VALUES ($1, $2, $3) RETURNING *;';
        const { rows } = await pool.query(query, [user_id, project_id, log_message]);
        return rows[0];
    }

    // Get Project Logs

    static async getProjectLogs({ project_id }) {
        const query = "SELECT * FROM project_logs WHERE project_id = $1;";
        const { rows } = await pool.query(query, [project_id]);
        return rows;
    }

    // Create User Log

    static async createUserLog({ user_id, log_message }) {
        const query = "INSERT INTO user_logs (user_id, log_message) VALUES ($1, $2) RETURNING *;";
        const { rows } = await pool.query(query, [user_id, log_message]);
        return rows[0];
    }

    // Get User Logs

    static async getUserLogs({ user_id }) {
        const query = "SELECT * FROM user_logs WHERE user_id = $1;";
        const { rows } = await pool.query(query, [user_id]);
        return rows[0];
    }
}
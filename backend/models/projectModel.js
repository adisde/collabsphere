import pool from "../config/db.js";

export default class Project {
    // Create Project

    static async createProject({ title, description, owner_id }) {
        const query = `INSERT INTO projects (title, description, owner_id) VALUES ($1, $2, $3) RETURNING *;`;
        const { rows } = await pool.query(query, [title, description, owner_id]);
        return rows[0];
    }

    // Update Project

    static async updateProject({ title, description, owner_id, id }) {
        const query = `UPDATE projects SET title = $1, description = $2, owner_id = $3 WHERE id = $4 RETURNING *;`;
        const { rows } = await pool.query(query, [title, description, owner_id, id]);
        return rows[0];
    }

    // Delete Project 

    static async removeProject({ id }) {
        const query = `DELETE FROM projects WHERE id = $1 RETURNING *;`;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    // Search Project For Owner

    static async searchProject({ user_id }) {
        const query = `SELECT * FROM projects WHERE owner_id = $1 RETURNING *;`;
        const { rows } = await pool.query(query, [user_id]);
        return rows;
    }

    // 
}

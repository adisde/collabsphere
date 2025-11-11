import pool from "../config/db.js";

export default class Task {
    // Create Task

    static async createTask({ assigned_to, project_id, title, description, status, due_date }) {
        const query = "INSERT INTO tasks (assigned_to, project_id, title, description, status, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;";
        const { rows } = await pool.query(query, [assigned_to, project_id, title, description, status, due_date]);
        return rows[0];
    }

    // Update Task

    static async updateTask({ assigned_to, project_id, title, description, status, due_date }) {
        const query = "UPDATE tasks SET assigned_to = $1, title = $3, description = $4, status = $5, due_date = $6 WHERE project_id = $2 RETURNING *;";
        const { rows } = await pool.query(query, [assigned_to, project_id, title, description, status, due_date]);
        return rows[0];
    }

    // Get Tasks 

    static async getTasks({ project_id }) {
        const query = "SELECT * FROM tasks WHERE project_id = $1;";
        const { rows } = await pool.query(query, [project_id]);
        return rows;
    }

    // Remove Tasks

    static async removeTask({ id }) {
        const query = "DELETE FROM tasks WHERE id = $1 RETURNING *;";
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}
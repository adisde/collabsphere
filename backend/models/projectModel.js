import pool from "../config/db.js";

export default class Project {
  static async createProject({ title, description, owner_id }) {
    const query = `INSERT INTO projects (title, description, owner_id) VALUES ($1, $2, $3) RETURNING *;`;
    const { rows } = await pool.query(query, [title, description, owner_id]);
    return rows[0];
  }

  static async updateProject({ title, description, updated_at, id }) {
    const query = `UPDATE projects SET title = $1, description = $2, updated_at = $3 WHERE id = $4 RETURNING *;`;
    const { rows } = await pool.query(query, [title, description, updated_at, id]);
    return rows[0];
  }

  static async removeProject({ id }) {
    const query = `DELETE FROM projects WHERE id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async searchProjectById({ project_id }) {
    const query = `SELECT * FROM projects WHERE id = $1;`;
    const { rows } = await pool.query(query, [project_id]);
    return rows[0];
  }

  static async searchAllProjectsForUser({ user_id }) {
    const query = `SELECT * FROM project_members WHERE user_id = $1;`;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  }
}

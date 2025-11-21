import pool from "../config/db.js";

export default class Notes {
  static async createNote({ project_id, user_id, title, content }) {
    const query =
      "INSERT INTO notes (project_id, user_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *;";
    const { rows } = await pool.query(query, [
      project_id,
      user_id,
      title,
      content,
    ]);
    return rows[0];
  }

  static async getNotes({ project_id }) {
    const query = "SELECT * FROM notes WHERE project_id = $1 ORDER BY created_at DESC LIMIT 20;";
    const { rows } = await pool.query(query, [project_id]);
    return rows;
  }

  static async getNote({ id }) {
    const query = "SELECT * FROM notes WHERE id = $1;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async updateNote({ title, content, id }) {
    const query =
      "UPDATE notes SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *;";
    const { rows } = await pool.query(query, [
      title,
      content,
      id,
    ]);
    return rows[0];
  }

  static async removeNote({ id }) {
    const query = "DELETE FROM notes WHERE id = $1 RETURNING *;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

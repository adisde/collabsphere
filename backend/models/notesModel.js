import pool from "../config/db.js";

export default class Notes {
  // Create Note

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

  // Get Notes

  static async getNotes({ project_id }) {
    const query = "SELECT * FROM notes WHERE project_id = $1;";
    const { rows } = await pool.query(query, [project_id]);
    return rows;
  }

  // Get Note (Single)

  static async getNote({ id }) {
    const query = "SELECT * FROM notes WHERE id = $1;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  // Update Note

  static async updateNote({ title, content, id }) {
    const query =
      "UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *;";
    const { rows } = await pool.query(query, [
      title,
      content,
      id,
    ]);
    return rows[0];
  }

  // Delete Note

  static async removeNote({ id }) {
    const query = "DELETE FROM notes WHERE id = $1 RETURNING *;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

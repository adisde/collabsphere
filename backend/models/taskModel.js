import pool from "../config/db.js";

export default class Task {
  static async createTask({
    assigned_to,
    project_id,
    title,
    description,
    status,
    due_date,
  }) {
    const query = `
      INSERT INTO tasks (assigned_to, project_id, title, description, status, due_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, assigned_to, title, description, status, due_date, created_at;
    `;
    const { rows } = await pool.query(query, [
      assigned_to,
      project_id,
      title,
      description,
      status,
      due_date,
    ]);
    return rows[0];
  }

  static async updateTask({
    assigned_to,
    id,
    title,
    description,
    status,
    due_date,
  }) {
    const query = `
      UPDATE tasks
      SET assigned_to = $1,
          title = $2,
          description = $3,
          status = $4,
          due_date = $5,
          updated_at = NOW()
      WHERE id = $6
      RETURNING id, assigned_to, title, description, status, due_date, updated_at, created_at;
    `;

    const { rows } = await pool.query(query, [
      assigned_to,
      title,
      description,
      status,
      due_date,
      id,
    ]);
    return rows[0];
  }

  static async getTasks({ project_id }) {
    const query = `
      SELECT *
      FROM tasks
      WHERE project_id = $1
      ORDER BY created_at DESC
      LIMIT 10;
    `;
    const { rows } = await pool.query(query, [project_id]);
    return rows;
  }

  static async getSingleTask({ id }) {
    const query = "SELECT * FROM tasks WHERE id = $1;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async removeTask({ id }) {
    const query = "DELETE FROM tasks WHERE id = $1 RETURNING id;";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async removeAllTasksForProject({ project_id }) {
    const query = "DELETE FROM tasks WHERE project_id = $1 RETURNING *;";
    const { rows } = await pool.query(query, [project_id]);
    return rows.length;
  }

   static async updateStatus({ id, status }) {
    const query = "UPDATE tasks SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *;";
    const { rows } = await pool.query(query, [id, status]);
    return rows[0];
  }
}

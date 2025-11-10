import pool from "../config/db.js";

export default class Member {
  // Creating Member

  static async createMember({ project_id, user_id, role }) {
    const query = `INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING *;`;
    const { rows } = await pool.query(query, [project_id, user_id, role]);
    return rows[0];
  }

  // Update Member

  static async updateMember({ role, project_id }) {
    const query = `UPDATE project_members SET role = $1 WHERE project_id = $2 RETURNING *;`;
    const { rows } = await pool.query(query, [role, project_id]);
    return rows[0];
  }

  // Search Member

  static async searchMember({ user_id }) {
    console.log(user_id);
    const query = `SELECT * FROM project_members WHERE user_id = $1;`;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  }

  // Remove Member

  static async removeMember({ user_id }) {
    const query = `DELETE FROM project_members WHERE user_id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
  }
}

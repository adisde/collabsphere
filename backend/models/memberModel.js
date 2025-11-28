import pool from "../config/db.js";

export default class Member {
  static async createMember({ project_id, user_id, role }) {
    const query = `INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING *;`;
    const { rows } = await pool.query(query, [project_id, user_id, role]);
    return rows[0];
  }

  static async updateMember({ role, user_id, project_id }) {
    const query = `UPDATE project_members SET role = $1, updated_at = NOW() WHERE user_id = $2 AND project_id = $3 RETURNING *;`;
    const { rows } = await pool.query(query, [role, user_id, project_id]);
    return rows[0];
  }

  static async searchMember({ user_id, project_id }) {
    const query = `SELECT * FROM project_members WHERE user_id = $1 AND project_id = $2 LIMIT 1;`;
    const { rows } = await pool.query(query, [user_id, project_id]);
    return rows[0];
  }

  static async removeMember({ user_id, project_id }) {
    const query = `DELETE FROM project_members WHERE user_id = $1 AND project_id = $2 RETURNING *;`;
    const { rows } = await pool.query(query, [user_id, project_id]);
    return rows[0];
  }

  static async searchMembers({ project_id }) {
    const query = `SELECT * FROM project_members WHERE project_id = $1 ORDER BY created_at DESC;`;
    const { rows } = await pool.query(query, [project_id]);
    return rows;
  }

  static async removeAllMembersForProject({ project_id }) {
    const query = `DELETE FROM project_members WHERE project_id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [project_id]);
    return rows.length;
  }
}

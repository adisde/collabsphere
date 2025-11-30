import pool from "../config/db.js";

export default class User {
  static async createUser({ username, email, password, isverified = false }) {
    const query = `INSERT INTO users (username, email, password, isverified) VALUES ($1, LOWER($2), $3, $4) RETURNING id, username, email;`;
    const { rows } = await pool.query(query, [
      username,
      email,
      password,
      isverified,
    ]);
    return rows[0] || null;
  }

  static async updatePassword({ user_id, password }) {
    const query = `UPDATE users SET password = $2, updated_at = NOW() WHERE id = $1 RETURNING id, username, email;`;
    const { rows } = await pool.query(query, [user_id, password]);
    return rows[0] || null;
  }

  static async getUserForLogin({ email }) {
    const query = `SELECT id, username, email, password, isverified FROM users WHERE email = $1 LIMIT 1;`;
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
  }

  static async searchEmail({ email }) {
    const query = `SELECT id, username, isverified, email FROM users WHERE email = $1 LIMIT 1;`;
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
  }

  static async searchUsername({ username }) {
    const query = `SELECT id, username, isverified, email FROM users WHERE username = $1 LIMIT 1;`;
    const { rows } = await pool.query(query, [username]);
    return rows[0] || null;
  }

  static async updateVerification({ user_id }) {
    const query = `UPDATE users SET isverified = TRUE, updated_at = NOW() WHERE id = $1 RETURNING id, username, email;`;
    const { rows } = await pool.query(query, [user_id]);
    return rows[0] || null;
  }

  static async removeUser({ user_id }) {
    const query = `DELETE FROM users WHERE id = $1 RETURNING id;`;
    const { rows } = await pool.query(query, [user_id]);
    return rows[0] || null;
  }

  static async updateUser({ username, user_id }) {
    const query = `UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2 RETURNING id, username, email;`;
    const { rows } = await pool.query(query, [username, user_id]);
    return rows[0] || null;
  }

  static async findById({ user_id }) {
    const query = `SELECT id, email, isverified, username FROM users WHERE id = $1;`;
    const { rows } = await pool.query(query, [user_id]);
    return rows[0] || null;
  }

  static async searchByEmail({ email, limit, offset, project_id }) {
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM users
    WHERE email ILIKE $1
    AND id NOT IN (
      SELECT user_id FROM project_members WHERE project_id = $2
    );
  `;
    const countValues = [`%${email}%`, project_id];
    const countResult = await pool.query(countQuery, countValues);
    const total = Number(countResult.rows[0].total);

    const query = `
    SELECT id, email
    FROM users
    WHERE email ILIKE $1
    AND id NOT IN (
      SELECT user_id FROM project_members WHERE project_id = $4
    )
    ORDER BY email
    LIMIT $2 OFFSET $3;
  `;
    const values = [`%${email}%`, limit, offset, project_id];
    const dataResult = await pool.query(query, values);

    return {
      users: dataResult.rows,
      count: total,
    };
  }
}

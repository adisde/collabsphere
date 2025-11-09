import pool from "../config/db.js";

export default class User {
  // Creating User

  static async createUser({ username, email, password, isverified = false }) {
    const query = `INSERT INTO users (username, email, password, isverified) VALUES ($1, $2, $3, $4) RETURNING id, username, email, isverified;`;
    const { rows } = await pool.query(query, [
      username,
      email,
      password,
      isverified,
    ]);
    return rows[0];
  }

  // Updating Password

  static async updatePassword({ email, password }) {
    const query = `UPDATE users SET password = $1 WHERE email = $2 RETURNING id, email;`;
    const { rows } = await pool.query(query, [email, password]);
    return rows[0];
  }

  // Search Email

  static async searchEmail({ email }) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  // Search Username

  static async searchUsername({ username }) {
    const query = `SELECT * FROM users WHERE username = $1`;
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  }

  // Update Verification

  static async updateVerification({ email, isverified = true }) {
    const query = `UPDATE users SET isverified = $2 WHERE email = $1 RETURNING email`;
    const { rows } = await pool.query(query, [email, isverified]);
    return rows[0];
  }

  // Delete User

  static async removeUser({ email }) {
    const query = `DELETE FROM users WHERE email = $1 RETURNING *`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }
}

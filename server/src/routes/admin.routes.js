const express = require("express");
const pool = require("../db/pool");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAdmin);

// GET /api/admin/stats — headline numbers for the admin dashboard
router.get("/stats", async (req, res) => {
  try {
    const [{ rows: userCount }, { rows: appCount }, { rows: selectedCount }, { rows: projectCount }] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS count FROM users WHERE is_admin = false`),
      pool.query(`SELECT COUNT(*)::int AS count FROM applications`),
      pool.query(`SELECT COUNT(*)::int AS count FROM applications WHERE selected = true`),
      pool.query(`SELECT COUNT(*)::int AS count FROM projects`),
    ]);
    res.json({
      students: userCount[0].count,
      applications: appCount[0].count,
      selected: selectedCount[0].count,
      projects: projectCount[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load stats." });
  }
});

// GET /api/admin/applications — every application, most recent first
router.get("/applications", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.first_name, a.last_name, a.email, a.school, a.board, a.class_level,
              a.status, a.score, a.percent, a.selected, a.created_at, a.completed_at,
              p.title AS project_title, p.company AS project_company
       FROM applications a
       LEFT JOIN projects p ON p.id = a.project_id
       ORDER BY a.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load applications" });
  }
});

// GET /api/admin/users — every registered student/user account
router.get("/users", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, phone, school, board, class_level, age, auth_provider, is_admin, created_at
       FROM users ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load users" });
  }
});

module.exports = router;

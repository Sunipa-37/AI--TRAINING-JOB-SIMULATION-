const express = require("express");
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/applications
// Body: { projectId, firstName, lastName, email, school, board, classLevel }
// If the request carries a valid Bearer token, the application is linked to that account.
router.post("/", async (req, res) => {
  const { projectId, firstName, lastName, email, school, board, classLevel } = req.body || {};

  if (!projectId || !firstName || !lastName || !email || !school || !board || !classLevel) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  const cls = parseInt(classLevel, 10);
  if (isNaN(cls) || cls <= 6 || cls > 12) {
    return res.status(400).json({ error: "You must be in Class 7 or above to apply for this project." });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO applications (user_id, project_id, first_name, last_name, email, school, board, class_level)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [req.user ? req.user.id : null, projectId, firstName, lastName, email, school, board, cls]
    );

    await pool.query(`UPDATE projects SET applicants_count = applicants_count + 1 WHERE id = $1`, [projectId]);

    if (req.user) {
      const project = await pool.query(`SELECT title FROM projects WHERE id = $1`, [projectId]);
      await pool.query(
        `INSERT INTO notifications (user_id, title, body) VALUES ($1,$2,$3)`,
        [
          req.user.id,
          "Application received",
          `We've received your application for "${project.rows[0] ? project.rows[0].title : "a project"}". Complete the quick assessment to finish applying.`,
        ]
      );
    }

    res.status(201).json({ applicationId: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save application." });
  }
});

// GET /api/applications/mine — application history for the logged-in user
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.status, a.score, a.percent, a.selected, a.created_at, a.completed_at,
              p.title AS project_title, p.company AS project_company
       FROM applications a
       LEFT JOIN projects p ON p.id = a.project_id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load application history." });
  }
});

module.exports = router;

const express = require("express");
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/notifications — the logged-in user's notifications, newest first
router.get("/", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, body, read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load notifications." });
  }
});

// PATCH /api/notifications/read-all
router.patch("/read-all", requireAuth, async (req, res) => {
  try {
    await pool.query(`UPDATE notifications SET read = true WHERE user_id = $1`, [req.user.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notifications." });
  }
});

module.exports = router;

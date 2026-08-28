const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// GET /api/community — sample forum posts
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, handle, body, created_at FROM community_posts ORDER BY created_at ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load community posts" });
  }
});

module.exports = router;

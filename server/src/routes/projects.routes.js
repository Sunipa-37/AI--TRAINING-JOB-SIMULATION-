const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// GET /api/projects?category=X&q=search — list projects, optionally filtered
router.get("/", async (req, res) => {
  const { category, q } = req.query;
  const conditions = [];
  const params = [];

  if (category && category !== "All") {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (q && q.trim()) {
    params.push(`%${q.trim()}%`);
    const idx = params.length;
    conditions.push(`(title ILIKE $${idx} OR company ILIKE $${idx} OR category ILIKE $${idx} OR EXISTS (SELECT 1 FROM unnest(tags) t WHERE t ILIKE $${idx}))`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const { rows } = await pool.query(
      `SELECT id, code, company, trust_badge AS "trustBadge", category, location, remote, title,
              description, pay_range AS pay, tags, applicants_count AS "applicantsCount"
       FROM projects ${where} ORDER BY id ASC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load projects" });
  }
});

// GET /api/projects/categories — distinct category list for the filter dropdown
router.get("/categories", async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT DISTINCT category FROM projects ORDER BY category ASC`);
    res.json(rows.map((r) => r.category));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load categories" });
  }
});

// GET /api/projects/:id — single project detail
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, code, company, trust_badge AS "trustBadge", category, location, remote, title,
              description, pay_range AS pay, tags, applicants_count AS "applicantsCount"
       FROM projects WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Project not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load project" });
  }
});

module.exports = router;

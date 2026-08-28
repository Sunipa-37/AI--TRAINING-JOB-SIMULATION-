const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// GET /api/quiz — questions WITHOUT correct answers
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, category, prompt, options FROM questions ORDER BY sort_order ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load quiz questions" });
  }
});

// POST /api/quiz/submit
// Body: { applicationId, answers: { [questionId]: selectedIndex } }
// Scoring happens server-side so answers can't be tampered with client-side.
router.post("/submit", async (req, res) => {
  const { applicationId, answers } = req.body || {};
  if (!applicationId || !answers || typeof answers !== "object") {
    return res.status(400).json({ error: "applicationId and answers are required." });
  }

  try {
    const { rows: questions } = await pool.query(`SELECT id, correct_index FROM questions`);

    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_index) score += 1;
    });
    const total = questions.length;
    const percent = total > 0 ? Math.round((score / total) * 10000) / 100 : 0;
    const selected = percent > 40;

    const { rows: updated } = await pool.query(
      `UPDATE applications
       SET status = 'quiz_completed', score = $1, percent = $2, selected = $3, completed_at = now()
       WHERE id = $4
       RETURNING user_id, project_id`,
      [score, percent, selected, applicationId]
    );

    if (updated[0] && updated[0].user_id) {
      const project = await pool.query(`SELECT title FROM projects WHERE id = $1`, [updated[0].project_id]);
      const title = project.rows[0] ? project.rows[0].title : "the project";
      await pool.query(
        `INSERT INTO notifications (user_id, title, body) VALUES ($1,$2,$3)`,
        [
          updated[0].user_id,
          selected ? "You're selected! 🎉" : "Assessment result ready",
          selected
            ? `Congratulations! You scored ${percent}% and have been selected for "${title}". Check your email for next steps.`
            : `You scored ${percent}% on the assessment for "${title}". Keep practicing and try another project.`,
        ]
      );
    }

    res.json({ score, total, percent, selected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

module.exports = router;

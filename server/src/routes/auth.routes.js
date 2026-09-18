const express = require("express");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const pool = require("../db/pool");
const { signToken, requireAuth } = require("../middleware/auth");

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    school: u.school,
    board: u.board,
    classLevel: u.class_level,
    age: u.age,
    avatarUrl: u.avatar_url,
    theme: u.theme,
    isAdmin: u.is_admin,
    authProvider: u.auth_provider,
    createdAt: u.created_at,
  };
}

function avatarFor(name) {
  return `https://ui-avatars.com/api/?background=14B8A6&color=fff&bold=true&name=${encodeURIComponent(name)}`;
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const {
    name, email, phone, school, board, classLevel, age,
    password, confirmPassword, adminCode,
  } = req.body || {};

  if (!name || !email || !phone || !school || !board || !classLevel || !age || !password || !confirmPassword) {
    return res.status(400).json({ error: "Please fill in every field to continue." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  const ageNum = parseInt(age, 10);
  if (isNaN(ageNum) || ageNum <= 6) {
    return res.status(400).json({ error: "Age must be above 6 to create an account." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const isAdmin = Boolean(
      process.env.ADMIN_SIGNUP_CODE && adminCode && adminCode === process.env.ADMIN_SIGNUP_CODE
    );

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, phone, school, board, class_level, age, password_hash, avatar_url, is_admin)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [name, email.toLowerCase(), phone, school, board, parseInt(classLevel, 10), ageNum, passwordHash, avatarFor(name), isAdmin]
    );
    const user = rows[0];

    await pool.query(
      `INSERT INTO notifications (user_id, title, body) VALUES ($1,$2,$3)`,
      [user.id, "Welcome to Trainly!", "Your account is ready. Browse open projects and apply to start training AI."]
    );

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create account." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const user = rows[0];
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log in." });
  }
});

// POST /api/auth/google
// Body: { credential } — the ID token from Google's "Sign in with Google" button.
// Requires GOOGLE_CLIENT_ID to be configured on the server (see .env.example).
router.post("/google", async (req, res) => {
  if (!googleClient) {
    return res.status(501).json({
      error: "Google login isn't configured on this server yet. Set GOOGLE_CLIENT_ID in server/.env to enable it.",
    });
  }
  const { credential } = req.body || {};
  if (!credential) return res.status(400).json({ error: "Missing Google credential." });

  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();

    let { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    let user = rows[0];

    if (!user) {
      const created = await pool.query(
        `INSERT INTO users (name, email, avatar_url, auth_provider)
         VALUES ($1,$2,$3,'google') RETURNING *`,
        [payload.name || email.split("@")[0], email, payload.picture || avatarFor(payload.name || email)]
      );
      user = created.rows[0];
      await pool.query(
        `INSERT INTO notifications (user_id, title, body) VALUES ($1,$2,$3)`,
        [user.id, "Welcome to Trainly!", "You signed in with Google. Complete your profile any time from Account details."]
      );
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Google sign-in failed. Please try again." });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    if (!rows[0]) return res.status(404).json({ error: "User not found." });
    res.json(publicUser(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load profile." });
  }
});

// PATCH /api/auth/theme  { theme: "light" | "dark" }
router.patch("/theme", requireAuth, async (req, res) => {
  const { theme } = req.body || {};
  if (!["light", "dark"].includes(theme)) {
    return res.status(400).json({ error: "Theme must be 'light' or 'dark'." });
  }
  try {
    await pool.query("UPDATE users SET theme = $1 WHERE id = $2", [theme, req.user.id]);
    res.json({ theme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update theme." });
  }
});

module.exports = router;

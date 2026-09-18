/**
 * Convenience script: applies schema.sql then seed.sql to the configured database,
 * and creates one ready-to-use admin account.
 * Run with: npm run db:setup
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const pool = require("./pool");

async function run() {
  const schemaPath = path.join(__dirname, "..", "..", "..", "database", "schema.sql");
  const seedPath = path.join(__dirname, "..", "..", "..", "database", "seed.sql");

  const schema = fs.readFileSync(schemaPath, "utf8");
  console.log("Applying schema...");
  await pool.query(schema);

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM projects");
  if (rows[0].count > 0) {
    console.log(`Projects table already has ${rows[0].count} rows — skipping seed.`);
  } else {
    const seed = fs.readFileSync(seedPath, "utf8");
    console.log("Applying seed data...");
    await pool.query(seed);
  }

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@trainly.app").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Trainly@Admin1";
  const existingAdmin = await pool.query("SELECT id FROM users WHERE email = $1", [adminEmail]);
  if (existingAdmin.rows.length === 0) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, is_admin, avatar_url)
       VALUES ($1,$2,$3,true,$4)`,
      [
        "Trainly Admin",
        adminEmail,
        hash,
        `https://ui-avatars.com/api/?background=12172B&color=fff&bold=true&name=Admin`,
      ]
    );
    console.log(`Created admin account: ${adminEmail} / ${adminPassword} (change this password after first login)`);
  } else {
    console.log(`Admin account ${adminEmail} already exists — skipping.`);
  }

  console.log("Database setup complete.");
  await pool.end();
}

run().catch((err) => {
  console.error("Database setup failed:", err);
  process.exit(1);
});

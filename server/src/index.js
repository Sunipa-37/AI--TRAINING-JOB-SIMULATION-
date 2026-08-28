require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { attachUser } = require("./middleware/auth");

const authRoutes = require("./routes/auth.routes");
const projectsRoutes = require("./routes/projects.routes");
const applicationsRoutes = require("./routes/applications.routes");
const quizRoutes = require("./routes/quiz.routes");
const notificationsRoutes = require("./routes/notifications.routes");
const adminRoutes = require("./routes/admin.routes");
const communityRoutes = require("./routes/community.routes");

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(attachUser);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/community", communityRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`Trainly API listening on http://localhost:${PORT}`);
});

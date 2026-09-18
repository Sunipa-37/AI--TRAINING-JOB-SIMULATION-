require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { attachUser } = require("./middleware/auth");

const authRoutes = require("./routes/auth.routes");
const projectsRoutes = require("./routes/projects.routes");
const applicationsRoutes = require("./routes/applications.routes");
const quizRoutes = require("./routes/quiz.routes");
const notificationsRoutes = require("./routes/notifications.routes");
const adminRoutes = require("./routes/admin.routes");
const communityRoutes = require("./routes/community.routes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(attachUser);

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/community", communityRoutes);

const sessions = {};
const BLOCKED = ['password', 'otp', 'pin', 'card', 'cvv', 'cvc'];
function hasBlockedKey(body) {
  if (!body || typeof body !== 'object') return false;
  return Object.keys(body).some(k => BLOCKED.some(b => k.toLowerCase().includes(b)));
}

function ensureSession(participantId) {
  if (!participantId) return null;
  if (!sessions[participantId]) {
    sessions[participantId] = {
      participantId,
      registration: { name: "Demo device" },
      testScore: null,
      currentStage: "APP_CONNECTED",
      events: [],
      telemetry: null,
      lastTelemetry: null,
      notifications: [],
      createdAt: Date.now(),
    };
  }
  return sessions[participantId];
}

app.post('/api/register', (req, res) => {
  try {
    if (hasBlockedKey(req.body)) return res.status(400).json({ error: "Forbidden field" });
    const { name, school, class: cls, city, email, mobile, domain } = req.body;
    if (!name || !email) return res.status(400).json({ error: "name and email required" });
    const participantId = `AI-${Math.floor(1000 + Math.random() * 9000)}`;
    sessions[participantId] = {
      participantId,
      registration: { name, school, class: cls, city, email, mobile, domain },
      testScore: null,
      currentStage: "REGISTERED",
      events: [],
      telemetry: null,
      lastTelemetry: null,
      notifications: [],
      createdAt: Date.now()
    };
    console.log(`SCAM REGISTERED ${participantId}`);
    res.json({ participantId });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/test', (req, res) => {
  try {
    const { participantId } = req.body;
    if (!participantId || !sessions[participantId]) return res.status(404).json({ error: "Participant not found" });
    const score = 85 + Math.floor(Math.random() * 14);
    sessions[participantId].testScore = score;
    sessions[participantId].currentStage = "TEST_PASSED";
    res.json({ score, passed: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.get('/api/session/:participantId', (req, res) => {
  try {
    const s = sessions[req.params.participantId];
    if (!s) return res.status(404).json({ error: "Not found" });
    res.json(s);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.get('/api/sessions', (req, res) => res.json(Object.values(sessions)));

let phoneNotifications = [];

app.post('/api/phone-notifications', (req, res) => {
  try {
    const { participantId, packageName, title, text, timestamp } = req.body;
    if (!participantId || !sessions[participantId]) {
      return res.status(404).json({ error: "Participant not found" });
    }
    const entry = {
      id: Date.now().toString(),
      participantId,
      packageName: packageName || 'unknown',
      title: (title || '').toString().substring(0, 120),
      text: (text || '').toString().substring(0, 400),
      timestamp: timestamp || new Date().toISOString(),
      receivedAt: new Date().toISOString()
    };
    phoneNotifications.unshift(entry);
    if (phoneNotifications.length > 500) phoneNotifications.pop();
    if (!sessions[participantId].notifications) sessions[participantId].notifications = [];
    sessions[participantId].notifications.unshift(entry);
    io.emit('notification:new', entry);
    io.emit('phone-notif', entry);
    console.log(`NOTIF ${participantId} ${packageName}: ${title}`);
    res.json({ ok: true, data: entry });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/phone-notifications', (req, res) => {
  const { participantId } = req.query;
  if (participantId) {
    return res.json(phoneNotifications.filter(n => n.participantId === participantId));
  }
  res.json(phoneNotifications);
});

app.post('/api/telemetry', (req, res) => {
  try {
    const body = req.body || {};
    const { participantId } = body;
    const session = ensureSession(participantId);
    if (!session) return res.status(400).json({ error: "participantId required" });
    const telemetry = { ...body, timestamp: new Date().toISOString() };
    session.telemetry = telemetry;
    session.lastTelemetry = telemetry;
    session.currentStage = "TELEMETRY_RECEIVED";
    io.emit('telemetryUpdated', telemetry);
    console.log('Telemetry', participantId, body.manufacturer, body.model);
    res.status(200).json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/events', (req, res) => {
  try {
    const { participantId, eventType, type, timestamp, details } = req.body || {};
    const session = ensureSession(participantId);
    if (!session) return res.status(400).json({ error: "participantId required" });
    const finalType = eventType || type || 'unknown';
    const event = { eventType: finalType, timestamp: timestamp || new Date().toISOString(), details };
    session.events.push(event);
    io.emit('eventLogged', { participantId, eventType: finalType, timestamp: event.timestamp });
    res.status(200).json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.get('/scam', (req, res) => res.send(`Scam Backend running. Sessions: ${Object.keys(sessions).length} | PhoneNotifs: ${phoneNotifications.length}`));
io.on('connection', socket => console.log('Dashboard connected', socket.id));

server.listen(PORT, () => {
  console.log(`Trainly + Scam Simulator listening on http://localhost:${PORT}`);
  console.log(`Police Dashboard: http://localhost:${PORT}/dashboard.html`);
});
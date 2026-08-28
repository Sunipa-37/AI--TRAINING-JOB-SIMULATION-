<<<<<<< HEAD
# Trainly — here students train AI

Trainly connects school and college students with real AI-training projects — labeling
data, reviewing model outputs, testing voice assistants, and more — so they can build
practical skills (and get paid) while still studying.

## What's inside

```
client/     React + Vite + Tailwind frontend
server/     Node + Express + PostgreSQL API
database/   schema.sql and seed.sql
```

## Features

- **Accounts & auth** — email/password signup (name, email, phone, school, board, class,
  age, password) plus "Continue with Google". JWT-based sessions.
- **Account menu** — profile dropdown with application history, notifications, account
  details, and a light/dark theme toggle.
- **Projects** — browsable, filterable (by category) and searchable AI-training project
  listings, each with a category tag, trust badge, and live applicant count.
- **Apply → Assessment flow** — students apply to a project, then take a 20-question
  school-level assessment (Maths, Science, SST, Conceptual, Descriptive). Scoring happens
  server-side.
- **Facilitator / Admin dashboard** — a role-gated dashboard with headline stats, a full
  applications table, and a students table.
- **About, Contact, Privacy, Terms** pages, and a centered navigation bar.

## Getting started

### 1. Database

You need a PostgreSQL database. Easiest local option with Docker:

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with user/password `postgres`/`postgres` and a
`trainly` database. (No Docker? Any local or hosted Postgres works — just point
`DATABASE_URL` at it in the next step.)

### 2. Server

```bash
cd server
cp .env.example .env     # edit values as needed — see comments in the file
npm install
npm run db:setup         # applies schema.sql + seed.sql, creates an admin account
npm run dev               # starts the API on http://localhost:4000
```

`npm run db:setup` prints the admin login it created (defaults to
`admin@trainly.app` / `Trainly@Admin1` unless you set `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` in `.env`). Log in with that account and visit `/dashboard` on the
frontend to see the facilitator dashboard.

Anyone who signs up through the normal signup form with the `ADMIN_SIGNUP_CODE` value
(set in `.env`) in the "Facilitator code" field also becomes an admin — useful for adding
more facilitators later without touching the database directly.

### 3. Client

```bash
cd client
cp .env.example .env     # edit VITE_API_URL if your API isn't on localhost:4000
npm install
npm run dev                # starts the frontend on http://localhost:5173
```

Open http://localhost:5173.

### 4. (Optional) Google Sign-In

By default, "Continue with Google" shows an honest explanatory message instead of doing
nothing silently. To turn on real Google sign-in:

1. Create an OAuth Client ID at https://console.cloud.google.com/apis/credentials
   (type: Web application; add your dev URL, e.g. `http://localhost:5173`, as an
   Authorized JavaScript origin).
2. Put the same Client ID in **both**:
   - `server/.env` → `GOOGLE_CLIENT_ID`
   - `client/.env` → `VITE_GOOGLE_CLIENT_ID`
3. Restart both the server and the client.

## Notes on the seed data

The sample projects in `database/seed.sql` use fictional company names for demo
purposes. Replace them with your own real project listings before using this in
production — either by editing `seed.sql` and re-running `npm run db:setup` on a fresh
database, or by adding an admin-facing "create project" screen (not included yet).

## Tech stack

- **Frontend:** React 18, React Router, Vite, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL (`pg`), JWT auth (`jsonwebtoken`), password
  hashing (`bcryptjs`), Google auth verification (`google-auth-library`)
=======
# AI Training Assistant — Demonstration APK

Controlled Android app for the police cybersecurity-awareness demo. Runs only
on the police-owned demonstration phone.

## What it does
Welcome screen → device verification (manufacturer/model/Android version,
battery, network type, all read with zero permissions) → explicit location
permission request → sends one telemetry payload to your Express backend →
completion screen → reveal screen explaining exactly what was collected.

## What it deliberately does NOT do
No contacts, SMS, call log, camera, microphone, installed-app list, clipboard,
background services, or persistence. If a teammate suggests "let's also grab
X to make it look more impressive," check it against section 33 of the master
plan first — the whole pedagogical point depends on staying inside the list.

## Before you build

1. **Set the backend URL.** Open
   `app/src/main/java/com/example/aitrainingassistant/ApiClient.kt` and set
   `BASE_URL` to your laptop's LAN IP for local testing:
   ```
   var BASE_URL = "http://192.168.1.10:5000"
   ```
   Find your laptop's IP with `ipconfig` (Windows) or `ifconfig`/`ip a`
   (Mac/Linux). Phone and laptop must be on the same Wi-Fi network.

2. **For the real demonstration**, switch to a real HTTPS endpoint and then:
   - In `AndroidManifest.xml`, set `android:usesCleartextTraffic="false"`.
   - Update `BASE_URL` to `https://...`.

## Backend contract (matches Member 3's Express routes)

`POST /api/events`
```json
{ "participantId": "AI-2048", "eventType": "APP_OPENED", "timestamp": 1735000000000 }
```

`POST /api/telemetry`
```json
{
  "participantId": "AI-2048",
  "manufacturer": "Samsung",
  "model": "SM-A556E",
  "androidVersion": "15",
  "sdkVersion": 35,
  "batteryPercentage": 73,
  "charging": false,
  "networkType": "Wi-Fi",
  "locationPermission": "GRANTED",
  "latitude": 26.72,
  "longitude": 88.42
}
```
Both endpoints should return any 2xx status. If the server is unreachable the
app doesn't crash or hang — it shows "continuing demonstration offline" and
moves on, so a Wi-Fi hiccup on stage doesn't kill the demo.

## Opening the project
Android Studio → Open → select the `AITrainingAssistant` folder. Let Gradle
sync, then Run on the demo phone (USB debugging on, or `Build → Generate APK`
to install manually).

## Rehearsal checklist (from the master plan, section 30)
- [ ] Location allowed
- [ ] Location denied
- [ ] Internet disconnected
- [ ] App backgrounded/resumed mid-flow
- [ ] Backend unavailable
>>>>>>> 457180f9cef6dcc5843cb1d604384ec197107d57

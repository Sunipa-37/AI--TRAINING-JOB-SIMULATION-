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

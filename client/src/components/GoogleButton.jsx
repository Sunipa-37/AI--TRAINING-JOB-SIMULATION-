import { useEffect, useRef, useState } from "react";
import { api } from "../api";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Renders Google's real "Sign in with Google" button when VITE_GOOGLE_CLIENT_ID
// is configured (see client/.env.example). Falls back to an explanatory,
// disabled-style button otherwise, so the UI never lies about what will happen.
export default function GoogleButton({ onSuccess, onError }) {
  const ref = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    if (window.google && window.google.accounts) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptReady || !CLIENT_ID || !ref.current) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: async (response) => {
        try {
          const data = await api.loginWithGoogle(response.credential);
          onSuccess(data);
        } catch (err) {
          onError && onError(err.message || "Google sign-in failed.");
        }
      },
    });
    window.google.accounts.id.renderButton(ref.current, {
      theme: "outline",
      size: "large",
      width: 320,
      text: "continue_with",
      shape: "pill",
    });
  }, [scriptReady, onSuccess, onError]);

  if (!CLIENT_ID) {
    return (
      <button
        type="button"
        className="btn-outline w-full flex items-center justify-center gap-2"
        onClick={() =>
          onError &&
          onError(
            "Google login isn't configured yet — set VITE_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID to enable it (see .env.example)."
          )
        }
      >
        <GoogleG />
        Continue with Google
      </button>
    );
  }

  return <div ref={ref} className="flex justify-center" />;
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 45c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 35.6 26.9 36.5 24 36.5c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.6 40.6 16.2 45 24 45z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.6 5.6C41.8 36.1 45 30.9 45 24c0-1.4-.1-2.4-.4-3.5z" />
    </svg>
  );
}

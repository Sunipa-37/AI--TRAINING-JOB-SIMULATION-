// Soft, slow-moving gradient blobs behind the whole app — subtle, not distracting.
// Rendered once in App.jsx via position:fixed so it sits behind every page.
export default function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div
        className="ambient-blob animate-blob1"
        style={{
          width: 520, height: 520, top: "-10%", left: "-8%",
          background: "radial-gradient(circle at 30% 30%, #14B8A6, transparent 70%)",
        }}
      />
      <div
        className="ambient-blob animate-blob2"
        style={{
          width: 480, height: 480, top: "10%", right: "-10%",
          background: "radial-gradient(circle at 60% 40%, #7C5CFF, transparent 70%)",
        }}
      />
      <div
        className="ambient-blob animate-blob3"
        style={{
          width: 440, height: 440, bottom: "-12%", left: "20%",
          background: "radial-gradient(circle at 50% 50%, #FFB020, transparent 72%)",
        }}
      />
    </div>
  );
}

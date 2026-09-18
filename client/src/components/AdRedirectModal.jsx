// Shown instead of redirecting to a (currently non-existent) marketplace page
// whenever a student clicks an ad preview, ad card, ad image, or ad button.
// The CTA below is intentionally non-functional for now.
export default function AdRedirectModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/55 z-[300] flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="surface rounded-2xl p-9 max-w-[380px] w-full text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[40px] mb-2">🛍️</div>
        <button type="button" className="btn-primary w-full">
          Continue in our app →
        </button>
      </div>
    </div>
  );
}

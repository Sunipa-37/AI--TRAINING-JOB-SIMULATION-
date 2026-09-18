import { useState } from "react";
import AdRedirectModal from "./AdRedirectModal";

// A single marketplace product/service styled like ProjectCard so it slots
// naturally into the Projects grid. Products show "Buy Now", courses and
// services show "Apply Now". Clicking anywhere on the card (image or button)
// opens a "coming soon" dialog instead of redirecting.
export default function MarketplaceAdCard({ product }) {
  const [open, setOpen] = useState(false);
  const isService = product.category === "Courses & Services";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="card !p-3 gap-3 hover:shadow-lg hover:shadow-ink/5 transition text-left w-full"
      >
        <div className="w-full aspect-[4/3] overflow-hidden rounded-xl">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <span className={isService ? "btn-primary text-center" : "btn-dark text-center"}>
          {isService ? "Apply Now" : "Buy Now"}
        </span>
      </button>
      <AdRedirectModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

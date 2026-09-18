import { useState } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../data/marketplaceProducts";
import AdRedirectModal from "./AdRedirectModal";
export default function MarketplacePreview({ count = 2, showViewAll = true, productIds }) {
    const featured = productIds
    ? productIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)
    : PRODUCTS.slice(0, count);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="max-w-[1180px] mx-auto px-6 py-14">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        {showViewAll && (
          <Link to="/marketplace" className="btn-outline shrink-0">
            View Marketplace
          </Link>
        )}
      </div>

      <div className={`grid gap-5 ${featured.length > 1 ? "sm:grid-cols-2" : "sm:grid-cols-1 max-w-[380px]"}`}>
        {featured.map((p) => {
          const isService = p.category === "Courses & Services";
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setModalOpen(true)}
              className="card !flex-row !p-4 gap-4 items-center hover:shadow-lg hover:shadow-ink/5 transition text-left w-full"
            >
              <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="tag mb-1 inline-block">{p.category}</span>
                <div className="font-bold text-[15px] truncate">{p.name}</div>
                <div className="font-mono font-semibold text-teal mt-0.5">₹{p.price}</div>
              </div>
              <span
                className={"shrink-0 text-sm !py-2 !px-4 " + (isService ? "btn-primary" : "btn-dark")}
              >
                {isService ? "Apply Now" : "Buy Now"}
              </span>
            </button>
          );
        })}
      </div>

      <AdRedirectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

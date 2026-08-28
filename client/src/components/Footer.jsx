import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border dark:border-white/10 bg-white/60 dark:bg-[#0F1330]/60">
      <div className="max-w-[1180px] mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 font-display font-bold text-lg mb-2">
            <span className="w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-teal to-violet flex items-center justify-center font-mono text-xs text-white">
              T
            </span>
            Trainly
          </div>
          <p className="text-inksoft text-[13px]">here students train AI</p>
        </div>

        <FooterCol
          title="Product"
          links={[
            ["/projects", "Browse Projects"],
            ["/how-it-works", "How It Works"],
            ["/community", "Community"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["/about", "About Us"],
            ["/contact", "Contact"],
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            ["/privacy", "Privacy Policy"],
            ["/terms", "Terms of Service"],
          ]}
        />
      </div>
      <div className="border-t border-border dark:border-white/10 px-6 py-5 text-center text-inksoft text-[12.5px]">
        © {new Date().getFullYear()} Trainly. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="font-semibold text-sm mb-3">{title}</div>
      <div className="flex flex-col gap-2">
        {links.map(([to, label]) => (
          <Link key={to} to={to} className="text-inksoft text-[13.5px] hover:text-teal transition">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

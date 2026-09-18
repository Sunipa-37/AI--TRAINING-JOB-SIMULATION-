export default function ContactPage() {
  return (
    <div className="max-w-[640px] mx-auto px-6 py-14 text-center">
      <div className="font-mono text-xs text-teal tracking-wide uppercase mb-3">Contact</div>
      <h1 className="font-display font-bold text-[28px] mb-4">We'd love to hear from you</h1>
      <p className="text-inksoft text-[15px] mb-10">
        Questions about a project, your account, or partnering with Trainly? Reach out any time.
      </p>

      <div className="grid sm:grid-cols-3 gap-4">
        <ContactCard
          icon="✉️"
          title="Email"
          detail="support@trainly.app"
          href="mailto:support@trainly.app"
        />
        <ContactCard
          icon="💬"
          title="Chat with us"
          detail="Mon–Sat, 10am–7pm IST"
        />
        <ContactCard
          icon="🏢"
          title="Office"
          detail="Siliguri, West Bengal, India"
        />
      </div>
    </div>
  );
}

function ContactCard({ icon, title, detail, href }) {
  const content = (
    <div className="card items-center text-center h-full">
      <div className="text-2xl">{icon}</div>
      <div className="font-bold text-sm">{title}</div>
      <div className="text-inksoft text-[13px]">{detail}</div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

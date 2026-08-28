export default function PrivacyPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-14">
      <h1 className="font-display font-bold text-[28px] mb-2">Privacy Policy</h1>
      <p className="text-inksoft text-sm mb-8">Last updated: August 2026</p>

      <div className="flex flex-col gap-6 text-[14.5px] leading-relaxed">
        <Section title="What we collect">
          When you create a Trainly account, we collect your name, email address, phone number,
          school, board, class, and age. When you apply to a project, we also store which project
          you applied to and your assessment results.
        </Section>
        <Section title="How we use it">
          We use this information to match you with relevant projects, track your application
          status, send you notifications about your applications, and — for facilitators — to
          review student progress on the admin dashboard.
        </Section>
        <Section title="Who can see it">
          Your application details are visible to Trainly's facilitator/admin accounts. We do not
          sell or share your personal information with third parties for advertising purposes.
        </Section>
        <Section title="Account security">
          Passwords are stored using one-way hashing and are never stored or visible in plain
          text. If you sign in with Google, we never see or store your Google password.
        </Section>
        <Section title="Your choices">
          You can review your stored account details at any time from the account menu in the
          navigation bar. To request deletion of your account and data, contact us using the
          details on our Contact page.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-bold text-[16px] mb-1.5">{title}</h2>
      <p className="text-inksoft">{children}</p>
    </div>
  );
}

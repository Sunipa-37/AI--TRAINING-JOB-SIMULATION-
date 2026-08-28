export default function TermsPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-14">
      <h1 className="font-display font-bold text-[28px] mb-2">Terms of Service</h1>
      <p className="text-inksoft text-sm mb-8">Last updated: August 2026</p>

      <div className="flex flex-col gap-6 text-[14.5px] leading-relaxed">
        <Section title="Eligibility">
          You must be above the age of 6 and enrolled in a recognized school or college board to
          create a Trainly account. Some projects may set a higher minimum age or class level.
        </Section>
        <Section title="Account responsibilities">
          You're responsible for keeping your password confidential and for all activity under
          your account. Please use accurate information when applying to projects.
        </Section>
        <Section title="Projects and assessments">
          Listings describe the nature of the work, expected pay range, and requirements as
          accurately as possible. Assessment scores are calculated automatically and are used
          only to help match you to suitable projects.
        </Section>
        <Section title="Acceptable use">
          Don't misuse the platform — this includes submitting false information, attempting to
          access another user's account, or attempting to interfere with the assessment scoring
          system.
        </Section>
        <Section title="Changes to these terms">
          We may update these terms from time to time. Continued use of Trainly after changes
          take effect means you accept the revised terms.
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

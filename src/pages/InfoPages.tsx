import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { brand } from "../config/brand";
import { authors } from "../data/authors";

function Shell({
  kicker,
  title,
  dek,
  children,
}: {
  kicker: string;
  title: string;
  dek: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-9 sm:px-6 sm:py-14 md:py-16">
        <p className="kicker">{kicker}</p>
        <h1 className="mt-2 font-display text-[2rem] font-medium leading-[1.08] tracking-[-0.025em] headline-balance sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-3.5 font-serif text-[17px] leading-[1.55] text-muted headline-pretty sm:mt-4 sm:text-xl">
          {dek}
        </p>
        <div className="prose-article mt-7 sm:mt-10">{children}</div>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <Shell
      kicker="About"
      title="A newsroom for people who have to make decisions."
      dek={`${brand.wordmark} is a demonstration technology publication designed for US and UK readers. The brand is a placeholder. The editorial ambition is not.`}
    >
      <p>
        We exist because the technology industry still produces more announcements than understanding.
        Signal Desk is built as a serious reading environment: long enough to be useful, short enough
        to respect a working day, and honest about what is known versus what is merely being said.
      </p>
      <h2
        id="what-we-cover"
        className="mb-4 mt-12 border-t border-rule pt-6 font-display text-[1.85rem] font-medium"
      >
        What we cover
      </h2>
      <p>
        Artificial intelligence, infrastructure, startups, cybersecurity, e-commerce and the business
        decisions that sit underneath all of them. We are particularly interested in the unfashionable
        parts of those stories: power, identity, unit economics, procurement, and the institutions that
        have to live with the consequences.
      </p>
      <h2
        id="who-we-are"
        className="mb-4 mt-12 border-t border-rule pt-6 font-display text-[1.85rem] font-medium"
      >
        The correspondents
      </h2>
      <p>These are demonstration author profiles for the prototype newsroom.</p>
      <ul className="my-6 list-none space-y-4 !pl-0">
        {authors.map((a) => (
          <li key={a.id} className="border-t border-rule pt-4">
            <Link to={`/author/${a.slug}`} className="font-display text-xl text-ink hover:text-emerald">
              {a.name}
            </Link>
            <p className="!mb-0 !mt-1 !text-base">
              {a.role}, {a.location}
            </p>
          </li>
        ))}
      </ul>
      <p>
        Offices: {brand.address.london}; {brand.address.sanFrancisco}. Email: {brand.contact.news}.
      </p>
    </Shell>
  );
}

export function ContactPage() {
  return (
    <Shell
      kicker="Contact"
      title="Reach the desk."
      dek="Use the right address. Tips are read. Press releases are triaged. Corrections are acted on."
    >
      <p>
        This contact page is part of the design prototype. Messages entered here are not transmitted.
      </p>
      <ul className="my-6 space-y-3">
        <li>
          <strong>News desk:</strong> {brand.contact.news}
        </li>
        <li>
          <strong>Secure tips:</strong> {brand.contact.tips}
        </li>
        <li>
          <strong>Corrections:</strong> {brand.contact.corrections}
        </li>
        <li>
          <strong>Advertising:</strong> {brand.contact.advertising}
        </li>
        <li>
          <strong>Press:</strong> {brand.contact.press}
        </li>
      </ul>
      <DemoForm />
    </Shell>
  );
}

export function EditorialPolicyPage() {
  return (
    <Shell
      kicker="Editorial policy"
      title="How we intend to work."
      dek="Independence, sourcing, labelling and the line between reporting and commentary — written as the policy a finished newsroom would publish."
    >
      <p>
        Signal Desk is editorially independent of advertisers, investors in companies we cover, and
        any future parent. Commercial relationships, if they exist, will be labelled. They will not
        commission, review or delay news coverage.
      </p>
      <h2 className="mb-4 mt-12 border-t border-rule pt-6 font-display text-[1.85rem] font-medium">
        Sourcing
      </h2>
      <p>
        We prefer named sources. Unnamed sources are used when the information is important, the
        source is in a position to know, and naming them would create a genuine risk. We do not grant
        anonymity to launder speculation. Composite or demonstration sourcing, as used throughout this
        prototype, will always be labelled as such.
      </p>
      <h2 className="mb-4 mt-12 border-t border-rule pt-6 font-display text-[1.85rem] font-medium">
        AI in the newsroom
      </h2>
      <p>
        Research tools, including any future Hermes agent, may assist with discovery and first-pass
        research. They do not publish. A named editor remains accountable for every story that reaches
        readers. Generated copy is never a substitute for reporting.
      </p>
      <h2 className="mb-4 mt-12 border-t border-rule pt-6 font-display text-[1.85rem] font-medium">
        Conflicts
      </h2>
      <p>
        Staff will disclose relevant financial interests. We do not trade on unpublished information.
        Outside speaking and consulting require editor approval.
      </p>
    </Shell>
  );
}

export function CorrectionsPolicyPage() {
  return (
    <Shell
      kicker="Corrections"
      title="If we get it wrong, we say so."
      dek="Errors of fact are corrected clearly, promptly and in the story itself. We do not bury them."
    >
      <p>
        Readers should write to {brand.contact.corrections} with the story URL, the passage in
        question, and the evidence. A corrections editor — in this prototype, a role rather than a
        live inbox — will review.
      </p>
      <p>
        Material errors receive a note at the foot of the article with date and description. Headlines
        that mislead are rewritten and marked. We distinguish between a correction, a clarification and
        an update.
      </p>
      <p>
        This prototype includes at least one demonstration correction so the pattern is visible in the
        product.
      </p>
    </Shell>
  );
}

export function PrivacyPage() {
  return (
    <Shell
      kicker="Privacy"
      title="What we would collect, if this were live."
      dek="This prototype stores nothing on a server. The policy below describes the intended live product."
    >
      <p>
        A finished Signal Desk site would collect the minimum needed to publish, take newsletter
        subscriptions, measure aggregated readership, and keep the newsroom secure. We would not sell
        personal data. We would not use third-party advertising cookies without consent.
      </p>
      <p>
        In this design-phase build, newsletter forms, search queries and admin interactions remain in
        your browser session only.
      </p>
      <p>
        For questions: {brand.contact.press}. This is not a live privacy notice for a production service.
      </p>
    </Shell>
  );
}

export function TermsPage() {
  return (
    <Shell
      kicker="Terms"
      title="Terms of use for this demonstration."
      dek="The stories on this site are illustrative design content. They are not news reports of real events."
    >
      <p>
        You may browse this prototype. You may not treat its contents as factual reporting, investment
        advice, or a statement by any real company named in passing as context.
      </p>
      <p>
        {brand.wordmark} is a placeholder brand. Names, marks and visual identity are intended to be
        replaced. All rights in the design remain with the project owner.
      </p>
      <p>Governing law for a future live service would be specified here. It is not specified now.</p>
    </Shell>
  );
}

function DemoForm() {
  return (
    <form
      className="mt-8 space-y-4 border border-rule bg-canvas p-6"
      onSubmit={(e) => {
        e.preventDefault();
        alert("Demo only — nothing was sent.");
      }}
    >
      <label className="block">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-muted">Name</span>
        <input name="name" autoComplete="name" className="mt-1 h-11 w-full border border-rule bg-paper px-3 text-base sm:text-sm" />
      </label>
      <label className="block">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-muted">Email</span>
        <input type="email" name="email" autoComplete="email" className="mt-1 h-11 w-full border border-rule bg-paper px-3 text-base sm:text-sm" />
      </label>
      <label className="block">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-muted">Message</span>
        <textarea name="message" rows={5} className="mt-1 w-full border border-rule bg-paper px-3 py-2 text-base sm:text-sm" />
      </label>
      <button type="submit" className="h-11 bg-emerald px-5 text-sm font-semibold text-paper">
        Send (demo)
      </button>
    </form>
  );
}

import { ContactForm } from "@/app/_components/contact-form";

const HANDLE = "flozo712";

export function Contact() {
  // Set CONTACT_EMAIL to the address business enquiries should reach.
  const email = process.env.CONTACT_EMAIL ?? `contact@${HANDLE}.com`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      // Tallest section on the page: the form gets room to breathe, and the
      // content sits centred rather than pinned to the top of the extra space.
      className="flex min-h-[80svh] scroll-mt-24 flex-col justify-center gap-4"
    >
      <h2
        id="contact-heading"
        className="text-xs font-semibold uppercase tracking-widest text-black/50 dark:text-white/50"
      >
        Sponsorships &amp; collabs
      </h2>
      <p className="max-w-prose text-sm text-zinc-600 dark:text-zinc-400">
        Working on something together — a sponsorship, a collab, or anything
        else business-related? Send it over and I&apos;ll get back to you.
      </p>

      <ContactForm />

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Prefer email?{" "}
        <a
          className="underline decoration-black/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-current dark:decoration-white/30"
          href={`mailto:${email}`}
        >
          {email}
        </a>{" "}
        · Everything else, say hi in{" "}
        <a
          className="underline decoration-black/20 underline-offset-4 transition-colors hover:text-foreground hover:decoration-current dark:decoration-white/30"
          href={`https://www.twitch.tv/${HANDLE}/chat`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitch chat
        </a>
        .
      </p>
    </section>
  );
}

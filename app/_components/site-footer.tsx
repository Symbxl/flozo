import Link from "next/link";

// Mirrors the navbar so the footer doubles as the bottom-of-page menu.
const SECTION_LINKS = [
  { href: "#socials", label: "Social Medias" },
  { href: "#contact", label: "Contact" },
];

export function SiteFooter() {
  const channel = process.env.TWITCH_CHANNEL ?? "flozo712";
  // Rendered on the server on every request, so this is always the real year.
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="scroll-mt-24 border-t border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          © {year} Flozo712. All rights reserved.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link
                href="/"
                className="text-sm text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground"
              >
                Home
              </Link>
            </li>
            {SECTION_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`https://www.twitch.tv/${channel}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground"
              >
                Twitch
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

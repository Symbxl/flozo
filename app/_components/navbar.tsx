import Link from "next/link";
import { MobileMenu } from "@/app/_components/mobile-menu";

// Every target lives on the home page, so the section entries are plain hash
// anchors — a jump, not a route transition to prefetch.
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "#socials", label: "Social Medias" },
  { href: "#contact", label: "Contact" },
  { href: "#footer", label: "Footer" },
];

// Same glyph as public/twitch.svg, inlined so it can take the brand purple
// from `currentColor` and dim on hover with the rest of the link.
function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 2400 2800"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M500 0 0 500v1800h600v500l500-500h400l900-900V0H500zm1700 1300-400 400h-400l-350 350v-350H600V200h1600v1100z" />
      <path d="M1700 550h200v600h-200V550zm-550 0h200v600h-200V550z" />
    </svg>
  );
}

const linkClass =
  "text-sm font-medium text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400 dark:hover:text-foreground";

export function Navbar() {
  const channel = process.env.TWITCH_CHANNEL ?? "flozo712";

  return (
    <header className="sticky top-0 z-50 border-b border-black/[.08] bg-white/80 backdrop-blur-md dark:border-white/[.145] dark:bg-black/80">
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-6 sm:px-10">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          Flozo712
        </Link>
        <a
          href={`https://www.twitch.tv/${channel}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Flozo712 on Twitch"
          className="text-[#9146FF] transition-opacity hover:opacity-70"
        >
          <TwitchIcon className="h-5 w-[17px]" />
        </a>

        <ul className="ml-auto hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              {href.startsWith("#") ? (
                <a href={href} className={linkClass}>
                  {label}
                </a>
              ) : (
                <Link href={href} className={linkClass}>
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <MobileMenu links={NAV_LINKS} />
      </nav>
    </header>
  );
}

import type { CSSProperties, ReactElement } from "react";

type IconProps = { className?: string };

// Brand glyphs inlined (no icon dependency) so each one can take its brand
// colour from `currentColor`, which the card sets from its own `--brand`.
function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2.2A3.6 3.6 0 0 0 4.2 7.8v8.4a3.6 3.6 0 0 0 3.6 3.6h8.4a3.6 3.6 0 0 0 3.6-3.6V7.8a3.6 3.6 0 0 0-3.6-3.6H7.8ZM12 7.9a4.1 4.1 0 1 0 0 8.2 4.1 4.1 0 0 0 0-8.2Zm0 2a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Zm5.5-4.6a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  );
}

// Same glyph as public/twitch.svg and the navbar mark.
function TwitchIcon({ className }: IconProps) {
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

function TikTokIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.2 2h3.4a5.7 5.7 0 0 0 5.7 5.7v3.4a9 9 0 0 1-5.7-2v6.5a6.6 6.6 0 1 1-6.6-6.6c.4 0 .8.03 1.2.1v3.6a3.2 3.2 0 1 0 2.2 3V2Z" />
    </svg>
  );
}

type Social = {
  name: string;
  handle: string;
  href: string;
  Icon: (props: IconProps) => ReactElement;
  // Twitch's glyph is 6:7, not square, so each entry sizes its own icon.
  iconClassName: string;
  // Brand colour, mixed into the card's tint, border, and glow at hover.
  brand: string;
};

const HANDLE = "flozo712";

const SOCIALS: Social[] = [
  {
    name: "Instagram",
    handle: `@${HANDLE}`,
    href: `https://www.instagram.com/${HANDLE}`,
    Icon: InstagramIcon,
    iconClassName: "h-5 w-5",
    brand: "#E1306C",
  },
  {
    name: "YouTube",
    handle: `@${HANDLE}`,
    href: `https://www.youtube.com/@${HANDLE}`,
    Icon: YouTubeIcon,
    iconClassName: "h-5 w-5",
    brand: "#FF0000",
  },
  {
    name: "Twitch",
    handle: `@${HANDLE}`,
    href: `https://www.twitch.tv/${HANDLE}`,
    Icon: TwitchIcon,
    iconClassName: "h-5 w-[17px]",
    brand: "#9146FF",
  },
  {
    name: "TikTok",
    handle: `@${HANDLE}`,
    href: `https://www.tiktok.com/@${HANDLE}`,
    Icon: TikTokIcon,
    iconClassName: "h-5 w-5",
    brand: "#FE2C55",
  },
];

function ArrowIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function SocialLinks() {
  return (
    <section
      id="socials"
      aria-labelledby="socials-heading"
      className="flex scroll-mt-24 flex-col gap-4"
    >
      <h2
        id="socials-heading"
        className="text-xs font-semibold uppercase tracking-widest text-black/50 dark:text-white/50"
      >
        Follow me
      </h2>
      <p className="max-w-prose text-sm text-zinc-600 dark:text-zinc-400">
        Live streams happen on Twitch — clips and highlights go up everywhere
        else. Same handle on all of them.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SOCIALS.map(({ name, handle, href, Icon, iconClassName, brand }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              // `--brand` drives every colour on the card, so one set of
              // classes covers all four platforms.
              style={{ "--brand": brand } as CSSProperties}
              className="group flex items-center gap-3 rounded-2xl border border-solid border-black/[.08] p-3 transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--brand)_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--brand)_6%,transparent)] hover:shadow-[0_10px_24px_-14px_color-mix(in_srgb,var(--brand)_75%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] dark:border-white/[.145] dark:hover:bg-[color-mix(in_srgb,var(--brand)_14%,transparent)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] text-[var(--brand)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--brand)_20%,transparent)]">
                <Icon className={iconClassName} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{name}</span>
                <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {handle}
                </span>
              </span>
              <ArrowIcon className="h-4 w-4 shrink-0 text-zinc-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

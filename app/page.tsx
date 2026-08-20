import Image from "next/image";
import { HeroVideo } from "@/app/_components/hero-video";
import { Contact } from "@/app/_components/contact";
import { SocialLinks } from "@/app/_components/social-links";
import { CHANNEL, getStreamStatus } from "@/lib/twitch";

// Must be a literal: Next statically analyses segment config.
// Keep in sync with STATUS_REVALIDATE_SECONDS in lib/twitch.ts.
export const revalidate = 60;

type IconProps = { className?: string };

// Inlined (no icon dependency) so it takes its colour from `currentColor`,
// like the brand glyphs in the navbar and social links.
function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <circle cx="8.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

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

export default async function Home() {
  const status = await getStreamStatus();
  const channelUrl = `https://www.twitch.tv/${CHANNEL}`;

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col gap-10 bg-white px-6 py-16 dark:bg-black sm:px-10 sm:py-20">
        <HeroVideo
          initialStatus={status}
          channel={CHANNEL}
          videoSrc={process.env.HERO_VIDEO_SRC ?? "/hero.mp4"}
          poster={process.env.HERO_VIDEO_POSTER}
        />

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[220px]"
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert h-4 w-[14px]"
              src="/twitch.svg"
              alt="Twitch logomark"
              width={14}
              height={16}
            />
            Watch live on Twitch
          </a>
          <a
            className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-solid border-black/[.08] px-5 transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,#9146FF_45%,transparent)] hover:bg-[color-mix(in_srgb,#9146FF_6%,transparent)] hover:shadow-[0_10px_24px_-14px_color-mix(in_srgb,#9146FF_75%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9146FF] dark:border-white/[.145] dark:hover:bg-[color-mix(in_srgb,#9146FF_14%,transparent)] md:w-[220px]"
            href={`${channelUrl}/schedule`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CalendarIcon className="h-[18px] w-[18px] shrink-0 text-[#9146FF]" />
            Stream schedule
            <ArrowIcon className="h-4 w-4 shrink-0 text-zinc-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#9146FF]" />
          </a>
        </div>

        <SocialLinks />

        <Contact />
      </main>
    </div>
  );
}

import type { ReactElement } from "react";

export type IconProps = { className?: string };
export type Icon = (props: IconProps) => ReactElement;

// Every glyph is inlined (no icon dependency) and painted with `currentColor`,
// so a card or button can hand it a brand colour and it follows along.

/** Twitch's glyph is 6:7, not square — size it with the `h-x w-[y]` pairs used at the call sites. */
export function TwitchIcon({ className }: IconProps) {
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

export function InstagramIcon({ className }: IconProps) {
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

export function YouTubeIcon({ className }: IconProps) {
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

export function TikTokIcon({ className }: IconProps) {
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

function stroke(className: string | undefined, width = 1.8) {
  return {
    viewBox: "0 0 24 24",
    className,
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: width,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: "false" as const,
  };
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...stroke(className)}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <circle cx="8.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg {...stroke(className, 2)}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...stroke(className)}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="m3.5 7 7.3 5.4a2 2 0 0 0 2.4 0L20.5 7" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...stroke(className)}>
      <path d="M21 12.5a7.5 7.5 0 0 1-7.5 7.5H9l-4.5 3v-4.2A7.5 7.5 0 0 1 9 5h4.5A7.5 7.5 0 0 1 21 12.5Z" />
      <path d="M9.5 12.5h5" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...stroke(className, 2.2)}>
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg {...stroke(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.2 8.9 15.5 12l-5.3 3.1V8.9Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

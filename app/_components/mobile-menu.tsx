"use client";

import Link from "next/link";
import { useRef } from "react";

type MenuLink = { href: string; label: string };

const itemClass =
  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]";

/**
 * Narrow screens can't fit the nav labels beside the wordmark, so they collapse
 * into a <details> disclosure. Hash links don't navigate away, so nothing
 * re-renders the panel shut — we close it by hand on click.
 */
export function MobileMenu({ links }: { links: MenuLink[] }) {
  const details = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (details.current) details.current.open = false;
  };

  return (
    <details ref={details} className="relative ml-auto sm:hidden">
      <summary className="flex h-9 cursor-pointer list-none items-center rounded-full border border-black/[.08] px-3 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] [&::-webkit-details-marker]:hidden">
        Menu
      </summary>
      <ul className="absolute right-0 top-11 flex w-44 flex-col gap-1 rounded-xl border border-black/[.08] bg-white p-2 shadow-lg dark:border-white/[.145] dark:bg-black">
        {links.map(({ href, label }) =>
          href.startsWith("#") ? (
            <li key={href}>
              <a href={href} className={itemClass} onClick={close}>
                {label}
              </a>
            </li>
          ) : (
            <li key={href}>
              <Link href={href} className={itemClass} onClick={close}>
                {label}
              </Link>
            </li>
          )
        )}
      </ul>
    </details>
  );
}

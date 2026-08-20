"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { StreamStatus } from "@/lib/twitch";

const POLL_INTERVAL_MS = 60_000;

// The hostname never changes for the life of the page, so there is nothing to
// subscribe to — this just reads it on the client without a hydration mismatch.
const noopSubscribe = () => () => {};
const getHostname = () => window.location.hostname;
const getServerHostname = () => null;

// Fixed locale and timezone so the server and client render the same string.
const vodDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatVodDate(createdAt: string | undefined) {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? null : vodDateFormat.format(date);
}

type HeroVideoProps = {
  initialStatus: StreamStatus;
  channel: string;
  videoSrc: string;
  poster?: string;
};

export function HeroVideo({
  initialStatus,
  channel,
  videoSrc,
  poster,
}: HeroVideoProps) {
  const [status, setStatus] = useState(initialStatus);
  const [videoFailed, setVideoFailed] = useState(false);
  // Twitch requires the embedding hostname up front, and it differs between
  // localhost and production, so we read it from the browser.
  const parent = useSyncExternalStore(
    noopSubscribe,
    getHostname,
    getServerHostname
  );

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/twitch/status", { cache: "no-store" });
      if (!res.ok) return;
      setStatus((await res.json()) as StreamStatus);
    } catch {
      // Offline or a blip — keep showing whatever we last knew.
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    // A backgrounded tab throttles timers, so re-check the moment it returns.
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refresh]);

  const { vod } = status;
  // Both the live stream and the VOD replay use the same Twitch player, so the
  // only difference is which parameter identifies the source.
  // Whether a Twitch player is what belongs here at all. Known during SSR,
  // unlike the player URL itself, which needs the browser's hostname.
  const wantsPlayer = (status.isLive && Boolean(channel)) || Boolean(vod);

  const playerSource = (() => {
    if (!parent) return null; // Pre-hydration — Twitch needs the hostname.
    const embed = (param: string, title: string) => ({
      src: `https://player.twitch.tv/?${param}&parent=${encodeURIComponent(
        parent
      )}&muted=true&autoplay=true`,
      title,
    });

    if (status.isLive && channel) {
      return embed(
        `channel=${encodeURIComponent(channel)}`,
        `${channel} live on Twitch`
      );
    }
    if (vod) {
      return embed(
        `video=${encodeURIComponent(vod.id)}`,
        vod.title ?? "Most recent broadcast"
      );
    }
    return null;
  })();

  const vodDate = formatVodDate(vod?.createdAt);

  return (
    <section className="w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-xl ring-1 ring-black/10 dark:ring-white/10">
        {playerSource ? (
          <iframe
            key={playerSource.src}
            className="absolute inset-0 h-full w-full"
            src={playerSource.src}
            title={playerSource.title}
            allowFullScreen
          />
        ) : wantsPlayer ? (
          // The player is one render away; showing the local fallback here
          // would flash a different video for a frame.
          <div className="absolute inset-0 animate-pulse bg-zinc-800" />
        ) : videoFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-800 to-zinc-950 px-6 text-center text-sm text-zinc-400">
            <p className="font-medium text-zinc-200">Offline right now</p>
            <p>
              No past broadcasts yet — add a placeholder at{" "}
              <code className="font-mono text-zinc-300">public{videoSrc}</code>
            </p>
          </div>
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
          />
        )}

        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          {status.isLive ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Live
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-zinc-500" />
              {vod ? "Latest VOD" : "Offline"}
            </>
          )}
        </div>
      </div>

      {status.isLive
        ? (status.title || status.game) && (
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {status.title && (
                <h2 className="text-lg font-semibold sm:text-xl">
                  {status.title}
                </h2>
              )}
              {status.game && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {status.game}
                  {typeof status.viewers === "number" &&
                    ` · ${status.viewers.toLocaleString("en-US")} watching`}
                </p>
              )}
            </div>
          )
        : vod && (
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {vod.title && (
                <h2 className="text-lg font-semibold sm:text-xl">
                  {vod.url ? (
                    <a
                      className="hover:underline"
                      href={vod.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {vod.title}
                    </a>
                  ) : (
                    vod.title
                  )}
                </h2>
              )}
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Most recent broadcast{vodDate ? ` · ${vodDate}` : ""}
              </p>
            </div>
          )}
    </section>
  );
}

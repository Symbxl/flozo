const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const HELIX_BASE = "https://api.twitch.tv/helix";

/** Channel the site is about; override per-environment with TWITCH_CHANNEL. */
export const CHANNEL = process.env.TWITCH_CHANNEL ?? "flozo712";

/** How long a live/offline result is reused before we ask Twitch again. */
export const STATUS_REVALIDATE_SECONDS = 60;
/** VODs only appear when a stream ends, so they need far less checking. */
const VOD_REVALIDATE_SECONDS = 300;
/** A channel's numeric user id never changes. */
const USER_REVALIDATE_SECONDS = 86_400;

export type TwitchVod = {
  /** Player-ready id, always `v`-prefixed. */
  id: string;
  title?: string;
  url?: string;
  createdAt?: string;
};

export type StreamStatus = {
  isLive: boolean;
  title?: string;
  game?: string;
  viewers?: number;
  startedAt?: string;
  /** Newest archived broadcast, used as the hero fallback when offline. */
  vod?: TwitchVod;
};

const OFFLINE: StreamStatus = { isLive: false };

type HelixStream = {
  title?: string;
  game_name?: string;
  viewer_count?: number;
  started_at?: string;
};

type HelixUser = { id?: string };

type HelixVideo = {
  id?: string;
  title?: string;
  url?: string;
  created_at?: string;
};

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAppAccessToken(
  clientId: string,
  clientSecret: string,
  forceRefresh = false
): Promise<string> {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Twitch token request failed: ${res.status}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    // Retire the token a minute early so we never send one mid-expiry.
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

type Credentials = { clientId: string; clientSecret: string };

/** Calls a Helix endpoint, refreshing the token once if it was rejected. */
async function helix<T>(
  endpoint: string,
  params: Record<string, string>,
  { clientId, clientSecret }: Credentials,
  revalidate: number
): Promise<T[] | null> {
  const url = `${HELIX_BASE}/${endpoint}?${new URLSearchParams(params)}`;
  const call = (token: string) =>
    fetch(url, {
      headers: { "Client-Id": clientId, Authorization: `Bearer ${token}` },
      // Shared across every visitor, so one poll covers the whole site.
      next: { revalidate },
    });

  let res = await call(await getAppAccessToken(clientId, clientSecret));
  if (res.status === 401) {
    res = await call(await getAppAccessToken(clientId, clientSecret, true));
  }
  if (!res.ok) return null;

  const body = (await res.json()) as { data?: T[] };
  return body.data ?? [];
}

async function getLatestVod(
  channel: string,
  credentials: Credentials
): Promise<TwitchVod | undefined> {
  // The videos endpoint keys off the numeric user id, not the login name.
  const users = await helix<HelixUser>(
    "users",
    { login: channel },
    credentials,
    USER_REVALIDATE_SECONDS
  );
  const userId = users?.[0]?.id;
  if (!userId) return undefined;

  const videos = await helix<HelixVideo>(
    "videos",
    { user_id: userId, type: "archive", first: "1", sort: "time" },
    credentials,
    VOD_REVALIDATE_SECONDS
  );
  const video = videos?.[0];
  if (!video?.id) return undefined;

  return {
    id: video.id.startsWith("v") ? video.id : `v${video.id}`,
    title: video.title,
    url: video.url,
    createdAt: video.created_at,
  };
}

/**
 * Returns whether the configured channel is streaming right now, and when it
 * isn't, the newest archived broadcast to play instead. Any misconfiguration
 * or Twitch outage resolves to plain "offline" so the hero degrades to the
 * local fallback video rather than breaking the page.
 */
export async function getStreamStatus(): Promise<StreamStatus> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const channel = CHANNEL;

  if (!clientId || !clientSecret || !channel) return OFFLINE;
  const credentials = { clientId, clientSecret };

  try {
    const streams = await helix<HelixStream>(
      "streams",
      { user_login: channel },
      credentials,
      STATUS_REVALIDATE_SECONDS
    );

    const stream = streams?.[0];
    if (stream) {
      return {
        isLive: true,
        title: stream.title,
        game: stream.game_name,
        viewers: stream.viewer_count,
        startedAt: stream.started_at,
      };
    }

    return { isLive: false, vod: await getLatestVod(channel, credentials) };
  } catch {
    return OFFLINE;
  }
}

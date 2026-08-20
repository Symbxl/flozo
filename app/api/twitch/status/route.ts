import { getStreamStatus } from "@/lib/twitch";

// The handler itself runs per request; the upstream Twitch call is what's
// cached (see STATUS_REVALIDATE_SECONDS), so polling clients stay cheap.
export async function GET() {
  const status = await getStreamStatus();

  return Response.json(status, {
    headers: { "Cache-Control": "no-store" },
  });
}

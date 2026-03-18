/**
 * Extracts the YouTube videoId from a standard watch URL.
 * e.g. "https://www.youtube.com/watch?v=dQw4w9WgXcQ" → "dQw4w9WgXcQ"
 * Returns null if the URL is not a valid YouTube watch URL.
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (
      (parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com') &&
      parsed.pathname === '/watch'
    ) {
      return parsed.searchParams.get('v');
    }
  } catch {
    // not a valid URL
  }
  return null;
}

/**
 * Parses an ISO 8601 duration string (e.g. "PT4M13S") to total seconds.
 */
function parseIso8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? '0', 10);
  const minutes = parseInt(match[2] ?? '0', 10);
  const seconds = parseInt(match[3] ?? '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Fetches duration info for a batch of YouTube videos using the Data API v3.
 *
 * @param items   Array of { videoId, index } pairs (videoId must be non-null).
 * @param apiKey  YouTube / Google Cloud API key (VITE_GEMINI_API_KEY).
 * @returns       Map from original index → { duration (seconds), isShorts }.
 */
export async function fetchVideoDurations(
  items: { videoId: string | null; index: number }[],
  apiKey?: string
): Promise<Map<number, { duration: number; isShorts: boolean }>> {
  const result = new Map<number, { duration: number; isShorts: boolean }>();

  const key = apiKey ?? import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    console.warn('[youtube] API key not set – skipping duration fetch');
    return result;
  }

  // Filter out items with null videoId and deduplicate by videoId
  const validItems = items.filter((i): i is { videoId: string; index: number } =>
    typeof i.videoId === 'string' && i.videoId.length > 0
  );
  if (validItems.length === 0) return result;

  // YouTube Data API allows up to 50 IDs per request
  const CHUNK_SIZE = 50;
  for (let offset = 0; offset < validItems.length; offset += CHUNK_SIZE) {
    const chunk = validItems.slice(offset, offset + CHUNK_SIZE);
    const ids = chunk.map(i => i.videoId).join(',');

    try {
      const url =
        `https://www.googleapis.com/youtube/v3/videos` +
        `?part=contentDetails&id=${encodeURIComponent(ids)}&key=${encodeURIComponent(key)}`;

      const res = await fetch(url);
      if (!res.ok) {
        const errText = await res.text();
        console.warn('[youtube] API error:', errText);
        continue;
      }

      const data: {
        items?: { id: string; contentDetails?: { duration?: string } }[];
      } = await res.json();

      // Build a quick lookup: videoId → duration in seconds
      const durationById = new Map<string, number>();
      for (const apiItem of data.items ?? []) {
        const raw = apiItem.contentDetails?.duration ?? '';
        durationById.set(apiItem.id, parseIso8601Duration(raw));
      }

      // Map back to original indices
      for (const { videoId, index } of chunk) {
        const duration = durationById.get(videoId);
        if (duration !== undefined) {
          result.set(index, { duration, isShorts: duration <= 60 });
        }
      }
    } catch (err) {
      console.warn('[youtube] fetchVideoDurations failed for chunk:', err);
    }
  }

  return result;
}

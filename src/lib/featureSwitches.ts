export const FEATURE_SWITCH_CACHE_KEY = "website-feature-switch-v2";
export const FEATURE_SWITCH_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function isFresh(timestamp: number) {
  return Number.isFinite(timestamp) && Date.now() - timestamp < FEATURE_SWITCH_TTL_MS;
}

/** Sync read so the app can paint without waiting on Salesforce. */
export function readCachedFeatureValues(): Record<string, boolean> | null {
  try {
    const cachedRaw = localStorage.getItem(FEATURE_SWITCH_CACHE_KEY);
    if (!cachedRaw) return null;
    const cached = JSON.parse(cachedRaw);
    const values = cached?.payload?.data?.values;
    if (!values || typeof values !== "object") return null;
    return values as Record<string, boolean>;
  } catch {
    return null;
  }
}

async function fetchFeatureSwitches() {
  const url = `/api/website-feature-switch`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Feature switch API failed: ${response.status}`);
  const payload = await response.json();
  if (!payload?.success || !payload?.data?.values) throw new Error("Invalid feature switch payload");
  return payload;
}

export async function getFeatureSwitchesOnLoad() {
  try {
    const cachedRaw = localStorage.getItem(FEATURE_SWITCH_CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (isFresh(cached?.fetchedAt) && cached?.payload?.data?.values) {
        return { source: "cache", payload: cached.payload };
      }
    }

    const payload = await fetchFeatureSwitches();
    localStorage.setItem(
      FEATURE_SWITCH_CACHE_KEY,
      JSON.stringify({ fetchedAt: Date.now(), payload })
    );
    return { source: "api", payload };
  } catch (error) {
    // Safe fallback if API fails: use stale cache if present.
    const staleRaw = localStorage.getItem(FEATURE_SWITCH_CACHE_KEY);
    if (staleRaw) {
      const stale = JSON.parse(staleRaw);
      if (stale?.payload?.data?.values) {
        return { source: "stale-cache", payload: stale.payload };
      }
    }
    throw error;
  }
}

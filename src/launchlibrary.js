const BASE_URL = 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/';

/** The free-tier API occasionally times out or 5xx's under load (observed live while building
 *  this actor) — retry transient failures a few times before surfacing a real error, rather than
 *  ever treating a hiccup as "zero launches." */
async function fetchWithRetry(url, { retries = 4, baseDelayMs = 1000 } = {}) {
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url, { headers: { Connection: 'close' } });
            if (res.ok) return res;
            if (![429, 500, 502, 503, 504].includes(res.status)) {
                throw new Error(`Launch Library API request failed: ${res.status} ${res.statusText}`);
            }
            lastErr = new Error(`Launch Library API returned ${res.status}`);
        } catch (err) {
            lastErr = err;
        }
        if (attempt < retries) {
            await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** attempt));
        }
    }
    throw lastErr;
}

export async function fetchLaunches({ keyword, daysAhead, maxResults }) {
    const now = new Date();
    const until = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    const url = new URL(BASE_URL);
    url.searchParams.set('net__gte', now.toISOString());
    url.searchParams.set('net__lte', until.toISOString());
    url.searchParams.set('ordering', 'net');
    url.searchParams.set('limit', String(Math.min(maxResults, 100)));
    if (keyword) url.searchParams.set('search', keyword);

    const res = await fetchWithRetry(url);
    const data = await res.json();

    return (data.results ?? []).map((launch) => ({
        name: launch.name,
        status: launch.status?.name ?? null,
        net: launch.net,
        windowStart: launch.window_start,
        windowEnd: launch.window_end,
        provider: launch.launch_service_provider?.name ?? null,
        providerType: launch.launch_service_provider?.type ?? null,
        rocket: launch.rocket?.configuration?.full_name ?? null,
        missionName: launch.mission?.name ?? null,
        missionType: launch.mission?.type ?? null,
        orbit: launch.mission?.orbit?.name ?? null,
        padName: launch.pad?.name ?? null,
        location: launch.pad?.location?.name ?? null,
        countryCode: launch.pad?.location?.country_code ?? null,
        url: launch.url,
    }));
}

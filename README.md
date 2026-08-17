# Rocket Launch Tracker

Get upcoming orbital rocket launches worldwide via the public [Launch
Library 2 API](https://ll.thespacedevs.com/): mission, rocket, launch
provider, pad/location, launch window, and status.

Built for aerospace, media, and space-industry teams tracking the
global launch manifest without checking multiple providers'
individual schedules.

## Input

```json
{
  "keyword": "",
  "daysAhead": 14,
  "maxResults": 25
}
```

| Field | Type | Description |
|---|---|---|
| `keyword` | string (optional) | Free-text search across mission name, rocket, and launch provider, e.g. `"SpaceX"` or `"Starlink"`. Leave blank for every upcoming launch. |
| `daysAhead` | number | Only return launches scheduled within this many days from now. Default `14`, max `180`. |
| `maxResults` | number | Max launches to return. Default `25`, max `100`. |

## Output

One record per upcoming launch:

```json
{
  "name": "Falcon 9 Block 5 | Starlink Group 17-50",
  "status": "Go for Launch",
  "net": "2026-08-19T02:00:00Z",
  "windowStart": "2026-08-19T01:50:00Z",
  "windowEnd": "2026-08-19T02:20:00Z",
  "provider": "SpaceX",
  "providerType": "Commercial",
  "rocket": "Falcon 9 Block 5",
  "missionName": "Starlink Group 17-50",
  "missionType": "Communication Constellation",
  "orbit": "Low Earth Orbit",
  "padName": "SLC-40",
  "location": "Cape Canaveral SFS, FL, USA",
  "countryCode": "USA",
  "url": "https://ll.thespacedevs.com/2.2.0/launch/..."
}
```

`net` ("no earlier than") is the current best-estimate launch time;
launch schedules shift frequently, so treat it as an estimate rather
than a guarantee.

## How it works

Direct calls to the public [Launch Library 2
API](https://ll.thespacedevs.com/2.2.0/) — no proxy, no key, no
scraping. The free tier occasionally times out or returns a transient
5xx under load; the actor retries with backoff before surfacing a
real error, so a hiccup isn't mistaken for "no launches."

## Pricing note

Billed per **search**, not per launch returned — one charge whether
the search returns 0 launches or 100.

## Related products

- [Space Weather Alert](https://github.com/timmKal01/space-weather-alert) — solar/geomagnetic conditions, not launch schedules

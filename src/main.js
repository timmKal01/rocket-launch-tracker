import { Actor, log } from 'apify';
import { fetchLaunches } from './launchlibrary.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const { keyword, daysAhead = 14, maxResults = 25 } = input;

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const LAUNCH_SEARCH_EVENT = 'launch-search';

const launches = await fetchLaunches({
    keyword,
    daysAhead: Math.min(daysAhead, 180),
    maxResults: Math.min(maxResults, 100),
});

for (const launch of launches) {
    await Actor.pushData(launch);
}

await Actor.charge({ eventName: LAUNCH_SEARCH_EVENT });

log.info(`Pushed ${launches.length} launch(es)`);

await Actor.exit();

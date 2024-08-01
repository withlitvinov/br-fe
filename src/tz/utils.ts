import { CamelizedTimeZoneDto } from './api';

type TzLocation = {
  location: string;
  utcOffset: number;
};

const compareStringAsc = (a: string, b: string) => {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
};

const buildTzMap = (tzs: CamelizedTimeZoneDto[]) => {
  const tzKeys: string[] = [];
  const tzMap: {
    [region: string]: TzLocation[];
  } = {};

  // Build time zone map
  for (const tz of tzs) {
    const [region, location] = tz.id.split('/');

    if (!location) {
      // Time zone is without location - do nothing
    } else {
      if (!tzMap[region]) {
        tzKeys.push(region);
        tzMap[region] = [
          {
            location,
            utcOffset: tz.utcOffset,
          },
        ];
      } else {
        tzMap[region].push({
          location,
          utcOffset: tz.utcOffset,
        });
      }
    }
  }

  // Sort region locations
  for (const tz of tzKeys) {
    tzMap[tz] = tzMap[tz].sort((a, b) =>
      compareStringAsc(a.location, b.location),
    );
  }

  // Get a time zone list
  const sortedTzKeys = tzKeys.sort();

  return { tzKeys: sortedTzKeys, tzMap };
};

const getFormattedTzOffset = (offset: number) => {
  const sign = offset >= 0 ? '+' : '-';
  const absSeconds = Math.abs(offset);
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${sign}${formattedHours}:${formattedMinutes}`;
};

export type { TzLocation };
export { buildTzMap, getFormattedTzOffset };

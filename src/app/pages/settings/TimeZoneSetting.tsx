import { SelectItemText } from '@radix-ui/react-select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components';
import { useDi } from '@/common/contexts';
import { MyApi } from '@/my';
import { TzApi } from '@/tz';

import { AUTHORIZED_MY_DETAILS_KEY, TIME_ZONES_KEY } from '../../constants';

const formatOffset = (offset: number) => {
  const sign = offset >= 0 ? '+' : '-';
  const absSeconds = Math.abs(offset);
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${sign}${formattedHours}:${formattedMinutes}`;
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

const TimeZoneSetting = () => {
  const queryClient = useQueryClient();
  const myApi = useDi(MyApi);
  const tzApi = useDi(TzApi);

  const [region, setRegion] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  const { data: my, isLoading: isMyLoading } = useQuery({
    queryKey: [AUTHORIZED_MY_DETAILS_KEY],
    queryFn: () => {
      return myApi.getMy();
    },
  });
  const { data: tzs, isLoading: isTzsLoading } = useQuery({
    queryKey: [TIME_ZONES_KEY],
    queryFn: () => {
      return tzApi.getTimeZones();
    },
  });
  const { mutate } = useMutation({
    mutationFn: (tz: string) => {
      return myApi.updateTz(tz);
    },
  });

  const isTimeZoneChanged = useMemo(() => {
    if (region && location && my) {
      return region + '/' + location !== my.config.timeZone;
    }

    return false;
  }, [region, location, my]);

  const tzMap = useMemo(() => {
    const tzMap: {
      [region: string]: {
        location: string;
        utcOffset: number;
      }[];
    } = {};

    if (!tzs) {
      return tzMap;
    }

    for (const tz of tzs) {
      const [region, location] = tz.id.split('/');

      if (!location) {
        // Do nothing
      } else {
        if (!tzMap[region]) {
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

    return tzMap;
  }, [tzs]);

  useEffect(() => {
    const regions = Object.keys(tzMap);

    if (regions.length === 0 || isMyLoading || isTzsLoading) {
      return;
    }

    if (my) {
      const [region, location] = my.config.timeZone.split('/');

      setRegion(region);
      setLocation(location);
    } else {
      setRegion(regions[0]);
      setLocation(
        tzMap[regions[0]].sort((a, b) =>
          compareStringAsc(a.location, b.location),
        )[0].location,
      );
    }
  }, [my, tzMap, isMyLoading, isTzsLoading]);

  const handleChangeRegion = (region: string) => {
    if (Object.keys(tzMap).length) {
      setRegion(region);
      setLocation(
        tzMap[region].sort((a, b) =>
          compareStringAsc(a.location, b.location),
        )[0].location,
      );
    }
  };

  const handleChangeLocation = (location: string) => {
    setLocation(location);
  };

  const handleCancel = () => {
    const regions = Object.keys(tzMap);

    if (regions.length === 0 || isMyLoading || isTzsLoading) {
      return;
    }

    if (my) {
      const [region, location] = my.config.timeZone.split('/');

      setRegion(region);
      setLocation(location);
    }
  };

  const handleSave = () => {
    if (isMyLoading || isTzsLoading || !my || !region || !location) {
      return;
    }

    const newTz = region + '/' + location;

    mutate(newTz, {
      onSuccess: () => {
        // Remove cache for all queries.
        // This required for invalidation of all queries that depend on time zone
        queryClient.resetQueries();
      },
    });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Label>Local time zone</Label>
      <div className="flex flex-col gap-y-2">
        <Select value={region ?? undefined} onValueChange={handleChangeRegion}>
          <SelectTrigger>
            <SelectValue placeholder="Loading..." />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(tzMap).length &&
              Object.keys(tzMap)
                .sort()
                .map((key) => (
                  <SelectItem key={key} value={key}>
                    <SelectItemText>{key}</SelectItemText>
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
        <Select
          value={location ?? undefined}
          onValueChange={handleChangeLocation}
        >
          <SelectTrigger>
            <SelectValue placeholder="Loading..." />
          </SelectTrigger>
          <SelectContent>
            {region &&
              Object.keys(tzMap).length &&
              tzMap[region]
                .sort((a, b) => compareStringAsc(a.location, b.location))
                .map((sub) => (
                  <SelectItem key={sub.location} value={sub.location}>
                    <div className="w-full flex justify-between">
                      <SelectItemText>{sub.location}</SelectItemText>
                      <span className="text-neutral-400">
                        {formatOffset(sub.utcOffset)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>
      {isTimeZoneChanged && (
        <div className="flex gap-x-2">
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export { TimeZoneSetting };

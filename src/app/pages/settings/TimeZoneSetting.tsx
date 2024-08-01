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

type TzState = {
  region: string | null;
  location: string | null;
};

type TzLocation = {
  location: string;
  utcOffset: number;
};

const TimeZoneSetting = () => {
  const queryClient = useQueryClient();
  const myApi = useDi(MyApi);
  const tzApi = useDi(TzApi);

  const [tz, setTz] = useState<TzState>({
    region: null,
    location: null,
  });

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
    if (tz.region && tz.location && my) {
      return tz.region + '/' + tz.location !== my.config.timeZone;
    }

    return false;
  }, [tz, my]);

  const { tzKeys, tzMap } = useMemo(() => {
    const tzKeys: string[] = [];
    const tzMap: {
      [region: string]: TzLocation[];
    } = {};

    if (!tzs) {
      return { tzKeys, tzMap };
    }

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
  }, [tzs]);

  useEffect(() => {
    if (tzKeys.length === 0 || isMyLoading || isTzsLoading) {
      return;
    }

    if (my) {
      const [region, location] = my.config.timeZone.split('/');

      setTz(() => ({
        region,
        location,
      }));
    } else {
      const headTz = tzKeys[0];

      setTz(() => ({
        region: headTz,
        location: tzMap[headTz][0].location,
      }));
    }
  }, [my, tzMap, isMyLoading, isTzsLoading]);

  const handleChangeRegion = (region: string) => {
    if (tzKeys.length) {
      setTz(() => ({
        region,
        location: tzMap[region][0].location,
      }));
    }
  };

  const handleChangeLocation = (location: string) => {
    setTz((prev) => ({
      ...prev,
      location,
    }));
  };

  const handleCancel = () => {
    const regions = Object.keys(tzMap);

    if (regions.length === 0 || isMyLoading || isTzsLoading) {
      return;
    }

    if (my) {
      const [region, location] = my.config.timeZone.split('/');

      setTz(() => ({
        region,
        location,
      }));
    }
  };

  const handleSave = () => {
    if (isMyLoading || isTzsLoading || !my || !tz.region || !tz.location) {
      return;
    }

    const newTz = tz.region + '/' + tz.location;

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
        <Select
          value={tz.region ?? undefined}
          onValueChange={handleChangeRegion}
        >
          <SelectTrigger>
            <SelectValue placeholder="Loading..." />
          </SelectTrigger>
          {tzKeys.length && (
            <SelectContent>
              {tzKeys.map((key) => (
                <SelectItem key={key} value={key}>
                  <SelectItemText>{key}</SelectItemText>
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>
        <Select
          value={tz.location ?? undefined}
          onValueChange={handleChangeLocation}
        >
          <SelectTrigger>
            <SelectValue placeholder="Loading..." />
          </SelectTrigger>
          {tzKeys.length && tz.region && (
            <SelectContent>
              {tzMap[tz.region].map((sub) => (
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
          )}
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

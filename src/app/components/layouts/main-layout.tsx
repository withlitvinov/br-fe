import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { LogOut as LogOutIcon, Settings as SettingsIcon } from 'lucide-react';
import { PropsWithChildren, useEffect } from 'react';
import { Link } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(tz);

import { AUTHORIZED_MY_DETAILS_KEY } from '@/app/constants';
import { useAuth } from '@/auth/auth.hook';
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  PageRootContainer,
} from '@/common/components';
import { useDi, usePageTitle } from '@/common/contexts';
import { MyApi } from '@/my';

const getNameInitials = (name: string) => {
  return name.split(' ').map((slice) => slice.charAt(0).toUpperCase());
};

const AccountMenu = () => {
  const { logout } = useAuth();
  const myApi = useDi(MyApi);

  const { data: my } = useQuery({
    queryKey: [AUTHORIZED_MY_DETAILS_KEY],
    queryFn: () => {
      return myApi.getMy();
    },
  });

  const handleClickLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="fit">
          <Avatar>
            <AvatarFallback>{my && getNameInitials(my.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-56" align="end">
          {my && (
            <DropdownMenuLabel className="flex flex-col">
              <span>{my.name}</span>
              <span className="font-normal text-neutral-400">{my.email}</span>
            </DropdownMenuLabel>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <button onClick={handleClickLogout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

type MainLayoutProps = PropsWithChildren;

export const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;

  const { title } = usePageTitle();

  const myApi = useDi(MyApi);

  const { data: my } = useQuery({
    queryKey: [AUTHORIZED_MY_DETAILS_KEY],
    queryFn: () => {
      return myApi.getMy();
    },
  });

  useEffect(() => {
    if (my) {
      const tz = my.config.timeZone;

      dayjs.tz.setDefault(tz);

      if (import.meta.env.DEV) {
        console.log(`Applied user's time zone: ${tz}`);
      }
    }
  }, [my]);

  return (
    <PageRootContainer>
      <div className="space-y-[48px]">
        <div className="flex gap-x-2 justify-between">
          <div className="text-xl">{title}</div>
          <AccountMenu />
        </div>
        <div>{children}</div>
      </div>
    </PageRootContainer>
  );
};

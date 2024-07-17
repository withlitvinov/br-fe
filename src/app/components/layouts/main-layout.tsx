import { LogOut as LogOutIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';

import { useAuth } from '@/auth/auth.hook';
import { Button, PageRootContainer } from '@/common/components';
import { usePageTitle } from '@/common/contexts';

type MainLayoutProps = PropsWithChildren;

export const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;

  const title = usePageTitle();
  const { logout } = useAuth();

  const handleClickLogout = () => {
    logout();
  };

  return (
    <PageRootContainer>
      <div className="space-y-[48px]">
        <div className="flex gap-x-2 justify-between">
          <div className="text-xl">{title}</div>
          <Button
            variant="outline"
            size="icon"
            rounded
            onClick={handleClickLogout}
          >
            <LogOutIcon width={16} height={16} />
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </PageRootContainer>
  );
};

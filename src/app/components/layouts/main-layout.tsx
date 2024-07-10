import { PropsWithChildren } from 'react';
import { LogOut as LogOutIcon } from 'lucide-react';

import { Button, PageRootContainer } from '@/common/components';
import { useAuth } from '@/auth/auth.hook.ts';

type MainLayoutProps = PropsWithChildren;

export const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;

  const { logout } = useAuth();

  const handleClickLogout = () => {
    logout();
  };

  return (
    <PageRootContainer>
      <div className="space-y-[24px]">
        <div className="flex gap-x-2 justify-between">
          <div className="text-xl">Welcome back 👋, {'{NAME}'}.</div>
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

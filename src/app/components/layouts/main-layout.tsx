import { PropsWithChildren } from 'react';

import { PageRootContainer } from '@/common/components';

type MainLayoutProps = PropsWithChildren<{}>;

export const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;

  return (
    <PageRootContainer>
      <div className="space-y-[24px]">
        <div className="text-xl">Welcome back 👋, {'{NAME}'}.</div>
        <div>{children}</div>
      </div>
    </PageRootContainer>
  );
};

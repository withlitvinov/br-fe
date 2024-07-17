import { PropsWithChildren } from 'react';

type PageRootContainerProps = PropsWithChildren;

export const PageRootContainer = (props: PageRootContainerProps) => {
  const { children } = props;

  return (
    <div className="mx-auto px-[24px] py-[24px] max-w-[768px]">{children}</div>
  );
};

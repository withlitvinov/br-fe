import { useContext, useEffect } from 'react';

import { PageTitleContext } from '@/common/contexts';

const usePageTitle = (title?: string | null) => {
  const context = useContext(PageTitleContext);

  useEffect(() => {
    if (title !== undefined) {
      context.updateTitle(title);
    }
  }, [context.updateTitle, title]);

  return {
    title: context.title,
    updateTitle: context.updateTitle,
  };
};

export { usePageTitle };

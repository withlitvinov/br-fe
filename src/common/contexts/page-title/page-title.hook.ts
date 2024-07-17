import { useContext, useEffect } from 'react';

import { PageTitleContext } from './page-title.context';

const usePageTitle = (title?: string | null) => {
  const context = useContext(PageTitleContext);

  useEffect(() => {
    if (title !== undefined) {
      context.updateTitle(title);
    }
  }, [context.updateTitle]);

  return context.title;
};

export { usePageTitle };

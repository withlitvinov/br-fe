import { createContext, PropsWithChildren, useState } from 'react';

type PageTitleContextValue = {
  title: string | null;
  updateTitle: (title: string | null) => void;
};

const PageTitleContext = createContext({} as PageTitleContextValue);

type PageTitleState = {
  title: string | null;
};

const defaultState: PageTitleState = {
  title: null,
};

type PageTitleProviderProps = PropsWithChildren;

const PageTitleProvider = (props: PageTitleProviderProps) => {
  const { children } = props;

  const [state, setState] = useState(defaultState);

  const updateTitle = (title: string | null) => {
    setState((prev) => ({
      ...prev,
      title,
    }));
  };

  return (
    <PageTitleContext.Provider
      value={{
        title: state.title,
        updateTitle,
      }}
    >
      {children}
    </PageTitleContext.Provider>
  );
};

export { PageTitleContext, PageTitleProvider };

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

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

  const updateTitle = useCallback(
    (title: string | null) => {
      setState((prev) => ({
        ...prev,
        title,
      }));
    },
    [setState],
  );

  const value = useMemo(
    () => ({
      title: state.title,
      updateTitle,
    }),
    [state, updateTitle],
  );

  return (
    <PageTitleContext.Provider value={value}>
      {children}
    </PageTitleContext.Provider>
  );
};

export { PageTitleContext, PageTitleProvider };

import type { ComponentProps, PropsWithChildren } from 'react';
import { createContext, useMemo, useContext } from 'react';

type FieldContextValue = {
  name?: string;
};

const FieldContext = createContext<FieldContextValue>({} as FieldContextValue);

type RootProps = PropsWithChildren<{
  name?: string;
}>;

const Root = (props: RootProps) => {
  const { children, name } = props;

  const value = useMemo(
    () => ({
      name,
    }),
    [name],
  );

  return (
    <FieldContext.Provider value={value}>
      <div className="min-w-0 h-[32px] border border-neutral-100">
        {children}
      </div>
    </FieldContext.Provider>
  );
};

type ControlProps = Omit<ComponentProps<'input'>, 'name'>;

const Control = (props: ControlProps) => {
  const { name } = useContext(FieldContext);

  return <input name={name} className="px-[12px] w-full h-full" {...props} />;
};

export { Root, Control };

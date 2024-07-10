import React, { ComponentProps, ComponentRef } from 'react';

import { Input, Label } from '.';

type InputWithLabelProps = ComponentProps<typeof Input> & {
  label?: string;
};

export const InputWithLabel = React.forwardRef<
  ComponentRef<typeof Input>,
  InputWithLabelProps
>((props, ref) => {
  const { name, label, ...restProps } = props;

  return (
    <div className="w-full grid gap-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input ref={ref} name={name} {...restProps} />
    </div>
  );
});

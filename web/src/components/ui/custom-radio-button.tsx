import React from "react";
import { Radio, cn, RadioProps } from "@heroui/react";

const CustomRadioButton = (props: RadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-transparent hover:bg-primary/5 hover:border-primary/80 items-center justify-between",
          "flex-row-reverse max-w-sm cursor-pointer rounded-lg gap-4 p-4 border-2 border-neutral-150",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default CustomRadioButton;

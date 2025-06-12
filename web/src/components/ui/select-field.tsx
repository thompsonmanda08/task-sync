import { cn } from "@/lib/utils";
import { OptionItem } from "@/types";
import { Select, SelectItem, SelectProps } from "@heroui/react";
import React from "react";

// omit children
type SelectFieldProps = {
  onChange?: (value: any) => void;
  options: OptionItem[];
  placeholder?: string;
  listItemName?: string;
  defaultValue?: string;
  className?: string;
  classNames?: { wrapper?: string };
  onError?: boolean;
  name?: string;
  [key: string]: any;
} & Omit<SelectProps, "children">;

function SelectField({
  value,
  variant = "bordered",
  onChange,
  options = [],
  placeholder,
  listItemName,
  defaultValue,
  className,
  classNames,
  onError,
  ...props
}: SelectFieldProps) {
  return (
    <div
      className={cn(
        `group relative flex w-full flex-col items-start justify-start gap-1`,
        classNames?.wrapper,
      )}
    >
      <Select
        className={cn("font-medium", className)}
        variant={variant}
        // selectedKeys={[value]} // Required for prefilled values
        value={value}
        onChange={onChange}
        isRequired={props?.required}
        isInvalid={onError}
        {...props}
      >
        {options.map((item, idx) => {
          let ItemValue = item?.key || item?.id || item;

          let ItemLabel =
            item?.name ||
            item?.label ||
            (listItemName ? item?.[listItemName] : undefined) ||
            item;

          return (
            <SelectItem
              key={ItemValue || idx}
              // value={ItemValue}
              classNames={{
                base: "data-[hover=true]:bg-primary/10 data-[selected=true]:text-white data-[selected=true]:bg-primary data-[selected=true]:font-semibold data-[selectable=true]:focus:text-primary data-[selectable=true]:focus:bg-primary/20 data-[selectable=true]:hover:text-primary data-[selected=true]:focus:text-white data-[selectable=true]:hover:bg-primary/20 data-[selectable=true]:font-[600] data-[selected=true]:focus:bg-primary data-[hover=true]:hover:text-white ",
              }}
            >
              {ItemLabel}
            </SelectItem>
          );
        })}
      </Select>
    </div>
  );
}

export default SelectField;

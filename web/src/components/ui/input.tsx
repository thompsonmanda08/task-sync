"use client";
import * as React from "react";
import { Input as NextUInput, InputProps } from "@heroui/react";

type InputCustomProps = InputProps & {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;

  error?: any;
};

import { EyeIcon, EyeOffIcon } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, InputCustomProps>(
  (
    {
      className,
      type,
      label,
      name,
      classNames,
      variant = "bordered",
      onError,
      error,
      maxLength,
      max,
      min,
      isDisabled,
      placeholder,
      endContent,
      startContent,
      defaultValue,
      labelPlacement,
      radius = "sm",
      size = "sm",
      ...props
    }: InputCustomProps,
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const validateEmail = (value: string) =>
      value?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const isInvalidEmail = React.useMemo(() => {
      if (type != "email" || props?.value === "") return false;
      return validateEmail(String(props?.value)) ? false : true;
    }, [props?.value, type]);

    return (
      <NextUInput
        label={label}
        size={size}
        placeholder={placeholder}
        isInvalid={props?.isInvalid || isInvalidEmail}
        errorMessage={error?.message || props?.errorMessage}
        max={max}
        min={min}
        radius={radius}
        className={className}
        classNames={classNames}
        variant={variant}
        defaultValue={defaultValue}
        disabled={isDisabled}
        maxLength={maxLength}
        labelPlacement={labelPlacement}
        type={isVisible && type == "password" ? "text" : type}
        startContent={startContent}
        endContent={
          type == "password" && String(props?.value)?.length > 1 ? (
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeOffIcon className="w-5 h-5 aspect-square text-default-400 pointer-events-none" />
              ) : (
                <EyeIcon className="w-5 h-5 aspect-square text-default-400 pointer-events-none" />
              )}
            </button>
          ) : (
            endContent
          )
        }
        ref={ref}
        name={name}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };

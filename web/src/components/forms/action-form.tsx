"use client";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Form from "next/form";
import { Input } from "../ui/input";

type ActionFormProps = {
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  handleOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  buttonText?: string;
  Icon?: React.ElementType;
  isIconButton?: boolean;
  ButtonIcon?: React.ElementType;
  action?: string;
  classNames?: {
    wrapper?: string;
    form?: string;
    input?: string;
    button?: string;
    clearFilter?: string;
    inputIcon?: string;
    buttonIcon?: string;
  };
  children?: React.ReactNode;
};

function ActionForm({
  handleSubmit,
  handleOnChange,
  value,
  placeholder = "Enter text here...",
  buttonText,
  Icon,
  isIconButton = false,
  ButtonIcon,
  action,
  classNames,
  children,
}: ActionFormProps) {
  return (
    <Form
      action={handleSubmit ? "" : String(action)}
      onSubmit={handleSubmit ? handleSubmit : undefined}
      className={cn(
        "group relative gap-2 flex max-w-sm w-full",
        { "static gap-0 block max-w-max": children },
        classNames?.form,
      )}
    >
      {children ? (
        // If children is passed, render it
        children
      ) : (
        <>
          <Input
            name="query"
            startContent={
              Icon ? (
                <Icon
                  className={cn(
                    "h-6 w-6 text-slate-300 transition-all group-focus-within:text-primary",
                    classNames?.inputIcon,
                  )}
                />
              ) : undefined
            }
            className={cn("w-full max-w-xl rounded-none", classNames?.input)}
            placeholder={placeholder}
            value={value}
            onChange={handleOnChange}
          />
          <Button
            type="submit"
            isIconOnly={isIconButton}
            className={cn("", classNames?.button, {
              "aspect-square": isIconButton,
            })}
            startContent={
              ButtonIcon ? (
                <ButtonIcon className={cn("h-6 w-6", classNames?.buttonIcon)} />
              ) : undefined
            }
          >
            {buttonText}
          </Button>
        </>
      )}
    </Form>
  );
}

export default ActionForm;

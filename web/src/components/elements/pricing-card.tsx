"use client";
import { Card, CardHeader, CardFooter, CardBody, Link } from "@heroui/react";
import { Button } from "../ui/button";
import { Logo } from "../base";
import { cn } from "@/lib/utils";

function PricingCard({
  title,
  href,
  description,
  buttonText,
  onPress,
  className,
  classNames,
  children,
}) {
  return (
    <Card
      isFooterBlurred
      className={cn(
        "w-max min-w-xs bg-primary-50/5 backdrop-blur-md h-[300px]",
        className,
        classNames?.base,
      )}
    >
      <CardHeader
        className={cn("flex-col items-start px-5 pt-5", classNames?.header)}
      >
        <div className="flex flex-grow gap-2">
          <Logo alt="Breathing app icon" className="rounded-full" isIcon />
          <div className="flex flex-col py-2">
            <p className="text-sm text-white uppercase font-bold">Basic</p>
            <p className="text-white/90 font-medium text-sm">
              Good for once-off
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody className={cn("min-w-[300px]", classNames?.body)}>
        {children}
      </CardBody>

      <CardFooter
        className={cn(
          "absolutee bg-primary-200/20 items-center justify-center bottom-0 px-4 z-10 border-t-1 border-default-100/50",
          classNames?.footer,
        )}
      >
        <Button
          size="md"
          as={href ? Link : undefined}
          href={href ? href : undefined}
          color="secondary"
          onPress={onPress}
        >
          {buttonText || "Buy"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PricingCard;

"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card, CardBody, CardFooter, Link } from "@heroui/react";

type ErrorProps = {
  error?: {
    status?: number;
    statusText?: string;
    message?: string;
  };
  classNames?: {
    card?: string;
  };
};

function ErrorCard({ error, classNames }: ErrorProps) {
  return (
    <Card
      className={cn(
        "m-auto shadow-none aspect-square w-full max-w-sm flex-auto p-6 font-inter self-start",
        classNames?.card,
      )}
    >
      {/* <CardHeader>
        <Logo href="/" isIcon={true} className="mx-auto" />
      </CardHeader> */}
      <CardBody className="flex cursor-pointer select-none flex-col w-full items-center justify-center p-0">
        <h2 className="text-[clamp(32px,5vw,60px)] font-bold leading-normal  text-foreground">
          {error?.status || "404"}
        </h2>
        <h3 className="text-lg font-semibold capitalize text-foreground mb-2">
          {error?.statusText || "Page not found"}
        </h3>
        <p className="text-center text-sm font-medium text-foreground/80">
          {error?.message || "The page you are looking for does not exist."}
        </p>
      </CardBody>

      <CardFooter className="flex items-center justify-center mt-4">
        <Button as={Link} href="/" className="w-full">
          Go back home
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ErrorCard;

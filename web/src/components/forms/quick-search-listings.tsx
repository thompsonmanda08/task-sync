"use client";
import React from "react";
import { Input } from "../ui/input";
import { MapPin, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import Form from "next/form";
import { cn } from "@/lib/utils";

function QuickSearchListingsForm() {
  return (
    <Form
      action={"/listings"}
      className={cn(
        "flex-col md:flex-row relative gap-4 divide-x- divide-primary flex w-full items-center",
      )}
    >
      <Input
        size="lg"
        variant="flat"
        name="residence"
        label={"Area/Residence"}
        placeholder={"Fairview"}
        startContent={
          <MapPin className="h-6 w-6 text-slate-300 transition-all group-focus-within:text-primary" />
        }
        className={"flex-1 group rounded-none bg-transparent min-w-[200px]"}
        classNames={{ inputWrapper: "bg-primary/10" }}
      />

      <hr className="h-[60px] border hidden md:block" />
      <Input
        size="lg"
        variant="flat"
        name="city"
        label={"City/Town"}
        placeholder={"Mufulira"}
        startContent={
          <MapPin className="h-6 w-6 text-slate-300 transition-all group-focus-within:text-primary" />
        }
        className={"flex-1 group rounded-none min-w-[200px] bg-transparent"}
        classNames={{ inputWrapper: "bg-primary/10" }}
      />
      <hr className="h-[60px] border hidden md:block" />
      <Button
        type="submit"
        size={"lg"}
        className="w-full md:w-auto"
        startContent={<SearchIcon className="h-6 w-6 text-white" />}
      >
        Search
      </Button>
    </Form>
  );
}

export default QuickSearchListingsForm;

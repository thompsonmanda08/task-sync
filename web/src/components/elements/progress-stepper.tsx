import { CheckCircleIcon } from "lucide-react";
import React from "react";

export default function ProgressStepper({ steps, currentStepIndex }: any) {
  return (
    <div className="before:content[''] relative z-0 my-8 flex flex-row items-center justify-between gap-4 text-base before:absolute before:left-0 before:right-0 before:z-10 before:h-[2px] before:bg-foreground/10 ">
      {/* CTA STEP */}
      {steps &&
        steps.map((step, index) => {
          return (
            <div
              key={index}
              className="z-10 flex cursor-pointer flex-row items-center justify-center gap-4 bg-card px-6 text-sm font-medium"
            >
              <span
                className={`${
                  currentStepIndex >= index
                    ? "bg-primary before:bg-primary/20"
                    : "bg-foreground/20 before:bg-foreground/10"
                }  before:content[''] relative grid aspect-square h-6 w-6 place-items-center rounded-full text-xs text-slate-50 before:absolute before:-inset-1.5 before:rounded-full`}
              >
                {currentStepIndex >= index + 1 ? (
                  <CheckCircleIcon className="p-0.5" />
                ) : (
                  `${index + 1}`
                )}
              </span>
              {step.title}
            </div>
          );
        })}
    </div>
  );
}

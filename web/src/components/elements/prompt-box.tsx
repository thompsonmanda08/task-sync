import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@heroui/react";

type PromptBoxProps = {
  title: string;
  message: string;
  triggerText?: string;
  buttonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  hideTrigger?: boolean;
  isLoading?: boolean;
  onOpen?: boolean;
  setOnOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  buttonVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  classNames?: {
    triggerClasses?: string;
    confirmButtonClasses?: string;
  };
  triggerComponent?: React.ReactNode;
};

export default function PromptBox({
  title,
  message,
  classNames,
  triggerText = "Open",
  buttonText = "Confirm",
  buttonVariant,
  onConfirm,
  onCancel,
  onOpen,
  setOnOpen,
  hideTrigger = false,
  isLoading = false,
  triggerComponent,
}: PromptBoxProps) {
  const { triggerClasses } = classNames || {};
  return (
    <AlertDialog open={onOpen} onOpenChange={setOnOpen}>
      {!hideTrigger && (
        <AlertDialogTrigger asChild>
          {triggerComponent || (
            <Button
              className={cn("", triggerClasses)}
              variant={buttonVariant || "outline"}
            >
              {triggerText}
            </Button>
          )}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-none bg-destructive hover:bg-destructive/80"
            onClick={onCancel}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn("", classNames?.confirmButtonClasses)}
          >
            {isLoading ? (
              <span className="flex max-w-max items-center justify-center gap-2">
                <Spinner size={"sm"} color={"white"} />
              </span>
            ) : (
              buttonText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function PromptModal({
  size = "lg",
  isOpen,
  onClose,
  onConfirm,
  title = "Prompt",
  cancelText = "Cancel",
  confirmText = "Confirm",
  isDisabled,
  isLoading,
  isDismissable = true,
  isKeyboardDismissDisabled = true,
  hideActionButtons,
  hideTitle,
  children,
}) {
  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      className={""}
    >
      <ModalContent>
        <>
          {!hideTitle && (
            <ModalHeader className="py-2 text-sm tracking-tight xl:text-base">
              {title}
            </ModalHeader>
          )}
          <ModalBody className={cn("gap-0 px-5", {})}>{children}</ModalBody>
          {!hideActionButtons && (
            <ModalFooter>
              <Button
                color="danger"
                isDisabled={isDisabled || isLoading}
                onPress={onClose}
              >
                {cancelText}
              </Button>
              <Button
                color="primary"
                isDisabled={isDisabled}
                isLoading={isLoading}
                onPress={onConfirm}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          )}
        </>
      </ModalContent>
    </Modal>
  );
}

export default PromptModal;

"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ToastAction } from "../ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@heroui/react";

const ContactForm = ({}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Make changes to the form
  const updateFormData = (name) => (e) => {
    setFormData({
      ...formData,
      [name]: e.target.value,
    });
  };

  async function handleFormSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    });

    const response = await res.json();

    if (response.status == 200) {
      toast({
        title: "Success!",
        description: "Your message has been sent.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsLoading(false);
      return;
    }

    toast({
      variant: "destructive",
      title: "Failed!",
      description: response.message,
      action: (
        <ToastAction onClick={handleFormSubmit} altText="Try again">
          Try Again
        </ToastAction>
      ),
    });
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-y-[24px] sm:mb-0 mb-[50px] w-full max-w-lg"
    >
      <Input
        classes="w-full"
        autoFocus
        isRequired
        value={formData.name}
        onChange={updateFormData("name")}
        name="name"
        label="Full Name"
        required
      />
      <Input
        classes="w-full max-w-full"
        name="email"
        type="email"
        isRequired
        value={formData.email}
        onChange={updateFormData("email")}
        label="Email Address"
        required
      />
      <Input
        classes="w-full"
        isRequired
        name="subject"
        value={formData.subject}
        onChange={updateFormData("subject")}
        label="Subject"
      />

      <Textarea
        name="message"
        label="Message"
        isRequired
        variant="bordered"
        value={formData.message}
        onChange={updateFormData("message")}
        placeholder="Type your message here."
      />

      <>
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          loadingText={"Sending..."}
    
          radius={"sm"}
          type="submit"
        >
          Send Message
        </Button>
      </>
    </form>
  );
};

export default ContactForm;

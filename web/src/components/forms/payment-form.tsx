"use client";
import { useState } from "react";
import { Check, CreditCard, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function PaymentForm() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <Card className="w-fullackdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle>Publish Your Property</CardTitle>
        <CardDescription>
          Complete payment and add your property details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Stepper */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`rounded-full p-2 ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="font-medium">Payment</span>
            </div>
            <div className="h-px w-16 bg-muted" />
            <div className="flex items-center space-x-2">
              <div
                className={`rounded-full p-2 ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <Building className="h-4 w-4" />
              </div>
              <span className="font-medium">Room Details</span>
            </div>
          </div>

          {/* Step 1: Payment Form */}
          {step === 1 && (
            <div className="space-y-6">
              <RadioGroup
                defaultValue={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="card"
                    id="card"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="mb-3 h-6 w-6" />
                    Card Payment
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="mobile"
                    id="mobile"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="mobile"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Phone className="mb-3 h-6 w-6" />
                    Mobile Money
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on card</Label>
                    <Input
                      id="cardName"
                      placeholder="Enter the name on your card"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="Enter your card number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="CVC" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Enter your mobile money number"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Room Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Input
                  id="roomType"
                  placeholder="e.g. Single, Double, Master"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Room Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Number of people"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities</Label>
                <Input
                  id="amenities"
                  placeholder="e.g. En-suite bathroom, Balcony"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Room Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the room"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          <Button
            className={step === 1 ? "w-full" : ""}
            onClick={() =>
              step < 2 ? setStep(step + 1) : console.log("Submit form")
            }
          >
            {step === 1 ? "Proceed to room details" : "Publish property"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

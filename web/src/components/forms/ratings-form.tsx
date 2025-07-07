"use client";
import React, { useState } from "react";
import { Avatar, Slider, Textarea } from "@heroui/react";
import { postAReview } from "@/app/_actions/listings-actions";
import { Button } from "../ui/button";
import { getUserInitials, notify } from "@/lib/utils";
import { useUserProfile } from "@/hooks/use-query-hooks";

export default function RatingsForm({ listingID }) {
  const { data: userResponse } = useUserProfile();
  const user = userResponse?.data;

  const [formData, setFormData] = useState({ rating: 1, comments: "" });
  const [error, setError] = useState({ status: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  function updateFormData(fields) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setError({ status: false, message: "" });
    setIsLoading(true);
    true;

    const sendReview = await postAReview(listingID, formData);

    if (sendReview?.success) {
      notify({
        title: "Success",
        description: "Review posted successfully",
      });
      setFormData({ rating: 1, comments: "" });
    } else {
      setError({ status: true, message: sendReview?.message });
      notify({
        title: "Failed to post a review",
        description: sendReview?.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmitReview}
      className="flex w-full max-w-full flex-col gap-4"
    >
      <div className="flex w-full justify-between">
        <div className="flex w-full flex-1 gap-5">
          <Avatar
            isBordered
            radius="lg"
      
            color="secondary"
          
            showFallback
            name={getUserInitials(`${user?.firstName} ${user?.lastName}`)}
            src={user?.profilePicture}
          />
          <div className="flex w-full flex-col items-start justify-center gap-1">
            <Slider
              defaultValue={1}
              size="sm"
              getValue={(rate) =>
                Array.from({ length: parseInt(rate) }).map((_) => "⭐")
              }
              marks={[
                {
                  value: 2,
                  label: "2⭐",
                },
                {
                  value: 3,
                  label: "3⭐",
                },
                {
                  value: 4,
                  label: "4⭐",
                },
                {
                  value: 5,
                  label: "5⭐",
                },
              ]}
              value={formData?.rating}
              onChange={(rate) => updateFormData({ rating: parseInt(rate) })}
              label="Slide to add Star Rating"
              classNames={{
                base: "gap-0",
                label: "text-primary font-medium text-sm mb-3",
                value: "text-primary font-bold text-xl",
              }}
              maxValue={5}
              minValue={1}
              showTooltip={true}
              color="primary"
              renderThumb={(props) => (
                <div
                  {...props}
                  className="group top-0 cursor-grab rounded-full bg-background/5 p-1 text-2xl data-[dragging=true]:cursor-grabbing"
                >
                  ⭐
                </div>
              )}
              step={1}
            />
          </div>
        </div>
      </div>
      <div className="px3 relative flex w-full flex-col gap-2 py-0 text-sm text-default-400">
        <Textarea
          label="Review Comment"
          variant="underlined"
          isRequired
          isInvalid={error?.status}
          errorMessage={error?.message}
          value={formData?.comments}
          onChange={(e) => updateFormData({ comments: e.target.value })}
        />
        <Button
          color="primary"
          type="submit"
          size="sm"
          radius="sm"
          className="ml-auto"
          loadingText={"Posting..."}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Add Review
        </Button>
      </div>
    </form>
  );
}

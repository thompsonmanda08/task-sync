"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Image } from "@heroui/react";
import { useEffect, useState } from "react";

export default function ImageSlider({ images }) {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList()?.length);
    setCurrent(api.selectedScrollSnap() + 1);
    setCurrentIndex(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative mx-0 flex w-full flex-1 flex-col items-center p-0">
      <Carousel
        // plugins={[
        //   Autoplay({
        //     delay: 7000 + current,
        //     stopOnInteraction: true,
        //     stopOnLastSnap: false,
        //   }),
        // ]}
        setApi={setApi}
        className="flex w-full flex-1"
      >
        <CarouselContent className="mx-auto h-full w-full">
          {images?.map((image, index) => (
            <CarouselItem
              key={index}
              className="flex items-center justify-center p-0"
            >
              <Image
                className="object-contain"
                src={image?.url}
                alt={"image"}
                height={700}
                priority
                unoptimized
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden lg:block">
          <CarouselPrevious className="-left-24 h-12 w-12 cursor-pointer bg-primary text-white hover:bg-primary-500/60" />
          <CarouselNext className="-right-24 h-12 w-12 cursor-pointer bg-primary text-white hover:bg-primary-500/60" />
        </div>
      </Carousel>
    </div>
  );
}

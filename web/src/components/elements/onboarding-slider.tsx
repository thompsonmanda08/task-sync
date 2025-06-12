"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

export default function OnboardingSlider({ slides }) {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState < number > 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    setCurrentIndex(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative flex w-full flex-1 flex-col items-center md:max-h-[100svh] md:min-h-screen">
      <Carousel
        plugins={[
          Autoplay({
            delay: 7000 + current,
            stopOnInteraction: true,
            stopOnLastSnap: false,
          }),
        ]}
        setApi={setApi}
        className="flex w-full flex-1"
      >
        <CarouselContent className="mx-0 flex h-full w-full flex-grow">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="p-0">
              <Image
                className="h-full w-full object-cover md:max-h-[100svh]"
                src={`/images/onboarding/image${index + 1}.jpg`}
                alt=""
                width={768}
                height={1280}
                priority
                // unoptimized
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <div className="hidden lg:block">
          <CarouselPrevious className="border-transparent bg-slate-50 text-primary hover:bg-slate-50/80 hover:text-primary" />
          <CarouselNext className="border-transparent bg-slate-50 text-primary hover:bg-slate-50/80 hover:text-primary" />
        </div> */}
      </Carousel>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex} // Ensure a unique key for each step
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              ease: "easeInOut",
              duration: 0.25,
            },
          }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          className="absolute top-32 z-50 mx-2 mb-8 flex max-w-lg flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-5 backdrop-blur-md md:mx-auto"
        >
          <h3 className="text-center text-[clamp(1rem,1rem+1vw,1.75rem)] font-semibold leading-10 text-white">
            {slides[currentIndex]?.title}
          </h3>

          <p className="w-full text-center text-[clamp(11px,11px+0.5vw,1.25rem)] leading-7 text-neutral-200">
            {slides[currentIndex]?.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

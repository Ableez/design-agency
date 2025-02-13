"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { stories } from "./data";

type Props = {};

const CarouselShowoff = (props: Props) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <div className="sticky -top-2 left-0 h-[40dvh] w-full overflow-clip">
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent>
            {stories.map((story) => (
              <CarouselItem key={story} className="pt-1 md:basis-1/2">
                <div>
                  <div>
                    <Image
                      alt="Story mock"
                      src={story}
                      width={400}
                      height={800}
                      className="h-screen w-full object-cover transition-opacity duration-500"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="absolute bottom-[42vh] flex h-28 w-full translate-y-10 items-center justify-center gap-2 bg-gradient-to-t from-black to-transparent py-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              current === index + 1
                ? "bg-white"
                : "bg-neutral-300 dark:bg-neutral-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselShowoff;

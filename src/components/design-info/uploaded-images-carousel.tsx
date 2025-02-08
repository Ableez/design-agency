import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "#/components/ui/carousel";
import Image from "next/image";

export function UploadedImagesCarousel({ images }: { images: string[] }) {
  return (
    <Carousel className="w-full max-w-xs py-6">
      <CarouselContent>
        {images.map((img) => (
          <CarouselItem key={img} className="basis-1/2">
            <div className="p-2">
              <Image
                src={img}
                alt={"Your upload"}
                width={120}
                height={120}
                className="rounded-2xl border dark:border-neutral-800"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

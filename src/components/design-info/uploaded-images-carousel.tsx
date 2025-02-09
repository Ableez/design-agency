import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "#/components/ui/carousel";
import Image from "next/image";
import { Button } from "../ui/button";
import { IconX } from "@tabler/icons-react";

export function UploadedImagesCarousel({
  images,
  handleRemoveImage,
}: {
  handleRemoveImage: (imageUrl: string) => void;
  images: string[];
}) {
  return (
    <Carousel className="w-full max-w-xs py-6">
      <CarouselContent>
        {images.map((img) => (
          <CarouselItem key={img} className="basis-1/3">
            <div className="group relative cursor-pointer rounded-2xl border bg-gradient-to-br from-neutral-600 via-black to-neutral-800 p-1 dark:border-neutral-800">
              <Button
                className="absolute -right-1 -top-1 z-20 scale-[0.6] opacity-0 group-hover:opacity-100"
                variant={"destructive"}
                size={"icon"}
                type="button"
                onClick={() => handleRemoveImage(img)}
              >
                <IconX width={20} className="h-6 w-6" />
              </Button>
              <Image
                src={img}
                alt={"Your upload"}
                width={120}
                height={120}
                className="aspect-square rounded-xl border object-cover dark:border-neutral-800"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

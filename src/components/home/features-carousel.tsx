import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";
import { Button } from "../ui/button";
import { IconDiamondFilled } from "@tabler/icons-react";

interface ImageData {
  src: string;
  top: number;
  left: number;
  rotation: number;
  scale: number;
}

const imagesData: ImageData[] = [
  {
    src: "https://plus.unsplash.com/premium_photo-1736959187025-3f104b1d9473?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIwfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
    top: 10,
    left: 10,
    rotation: 0 - 10,
    scale: 0.1 + 0.85,
  },
  {
    src: "https://i.pinimg.com/736x/e9/e3/0d/e9e30d0e73b119c69e6cc2b582805c71.jpg",
    top: 10,
    left: 38,
    rotation: 17 - 10,
    scale: 0.2 + 0.95,
  },
  {
    src: "https://i.pinimg.com/736x/8e/38/7b/8e387b5d6ba0bb4e02a8b152d86a87bf.jpg",
    top: 10,
    left: 64,
    rotation: 20 - 20,
    scale: 0.1 + 0.9,
  },
  {
    src: "https://i.pinimg.com/736x/99/9a/5c/999a5c6846b4a5d7b9124cce8eca0b3a.jpg",
    top: 50,
    left: 23,
    rotation: 20 - 40,
    scale: 0.1 + 0.98,
  },
  {
    src: "https://i.pinimg.com/736x/a6/87/d8/a687d84944c69aee7afdefd66fca45dd.jpg",
    top: 47,
    left: 55,
    rotation: 20 - 10,
    scale: 0.1 + 0.9,
  },
];

const FeaturesCarousel = () => {
  return (
    <div className="flex flex-col place-items-center justify-center align-middle">
      <div className="flex place-items-center justify-center gap-2 align-middle">
        <IconDiamondFilled />
        <h4 className="text-left text-2xl font-semibold">For your brand</h4>
      </div>

      <Carousel
        className="w-full"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          <CarouselItem className="pt-1 md:basis-1/2">
            <div className="p-6">
              <div className="h-[70dvh] w-full cursor-pointer rounded-3xl border ring-2 ring-transparent transition-all duration-300 ease-in-out hover:scale-[0.98] hover:ring-blue-600/30 dark:border-neutral-800">
                <div className="h-[60%]">
                  <div className="relative h-full w-full">
                    {imagesData.map((img, idx) => (
                      <Image
                        key={img.src}
                        src={img.src}
                        alt={"Image deco"}
                        width={190}
                        height={250}
                        style={{
                          position: "absolute",
                          top: `${img.top}%`,
                          left: `${img.left}%`,
                          transform: `rotate(${img.rotation}deg) scale(${img.scale})`,
                        }}
                        className="h-[110px] w-[90px] rounded-2xl object-cover"
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 px-6 py-2">
                    <h4 className="max-w-[60%] text-xl font-semibold">
                      Get full coverage branding
                    </h4>
                    <p className="mt-2 text-sm font-medium dark:text-neutral-400">
                      Get all what your brand needs to have to stand out and
                      grow.
                    </p>
                    <Button className="w-full">Get started</Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
          <CarouselItem className="pt-1 md:basis-1/2">
            <div className="p-6">
              <div className="h-[70dvh] w-full cursor-pointer overflow-clip rounded-3xl border pt-4 ring-2 ring-transparent transition-all duration-300 ease-in-out hover:scale-[0.98] hover:ring-blue-600/30 dark:border-neutral-800">
                <div className="h-[70%]">
                  <div className="flex flex-col gap-3 px-6 py-2">
                    <h4 className="max-w-[60%] text-xl font-semibold">
                      Get full coverage branding
                    </h4>
                    <p className="mt-2 text-sm font-medium dark:text-neutral-400">
                      Get all what your brand needs to have to stand out and
                      grow.
                    </p>
                    <Button className="w-full">Get started</Button>
                  </div>
                  <div className="mt-2 flex w-full justify-end">
                    <div className="relative h-full w-[90%] translate-x-5 rounded-tl-3xl border bg-gradient-to-br from-blue-200/20 to-red-800/5 p-4 dark:border-neutral-600">
                      <Image
                        src={
                          "https://i.pinimg.com/736x/17/80/3e/17803ee3d510e6dbdbc400fe1c6ae83c.jpg"
                        }
                        alt={"Image deco"}
                        width={400}
                        height={400}
                        className="w-full rounded-tl-2xl object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default FeaturesCarousel;

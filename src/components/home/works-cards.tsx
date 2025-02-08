import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";
import {
  IconBrandInstagramFilled,
  IconBriefcaseFilled,
  IconPaletteFilled,
} from "@tabler/icons-react";

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

const WorksCards = () => {
  return (
    <div className="flex flex-col place-items-center justify-center align-middle">
      <div className="flex place-items-center justify-center gap-2 align-middle">
        <IconPaletteFilled />
        <h4 className="text-left text-2xl font-semibold">Our works</h4>
      </div>
      <Carousel
        className="w-full"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {imagesData.map((image, index) => (
            <CarouselItem key={image.src} className="pt-1 md:basis-1/2">
              <div className="p-6">
                <div className="relative h-[80vh] w-full cursor-pointer overflow-clip rounded-3xl ring-8 ring-blue-600/20 transition-all duration-300 ease-in-out hover:scale-[0.98] hover:ring-blue-600/30">
                  <div className="relative h-[70%]">
                    <div className="relative h-full w-full">
                      <Image
                        src={image.src}
                        alt={"Image deco"}
                        width={290}
                        height={450}
                        className="h-[80vh] w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 flex w-full flex-col bg-gradient-to-t from-black to-transparent p-6 align-middle">
                    <div className="py-1">
                      <Image
                        src={
                          "https://cdn.worldvectorlogo.com/logos/puma-ag.svg"
                        }
                        alt="Brand mockup"
                        width={42}
                        height={42}
                      />
                    </div>
                    <p>Brand identity design</p>
                    <div className="flex gap-3 py-1">
                      <p className="flex place-items-center gap-1 align-middle text-sm font-semibold text-blue-600">
                        <IconBrandInstagramFilled size={16} />
                        @brand
                      </p>
                      <p className="text-sm font-bold text-blue-600">
                        www.brand.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default WorksCards;

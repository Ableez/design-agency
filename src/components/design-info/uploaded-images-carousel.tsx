import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "#/components/ui/carousel";
import Image from "next/image";
import { Button } from "../ui/button";
import { IconLoader2, IconX } from "@tabler/icons-react";
import { cn } from "#/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { IconCheck, IconPhotoExclamation } from "@tabler/icons-react";

export type ImageStatus = "uploading" | "uploaded" | "failed";

export type CarouselImage = {
  url: string;
  status: ImageStatus;
  clientId: string;
};

export function UploadedImagesCarousel({
  images,
  handleRemoveImage,
  onRetry,
}: {
  handleRemoveImage: (clientId: string) => void;
  onRetry?: (clientId: string) => void;
  images: CarouselImage[];
}) {
  return (
    <Carousel className="w-full max-w-xs py-6">
      <CarouselContent>
        {images.map((img) => (
          <CarouselItem key={img.clientId} className="basis-1/3">
            <div className="group relative cursor-pointer rounded-2xl border bg-gradient-to-br from-neutral-600 via-black to-neutral-800 p-1 dark:border-neutral-800">
              <Button
                className="absolute -right-1 -top-1 z-20 scale-[0.6] opacity-0 group-hover:opacity-100"
                variant={"destructive"}
                size={"icon"}
                type="button"
                onClick={() => handleRemoveImage(img.clientId)}
              >
                <IconX width={20} className="h-6 w-6" />
              </Button>

              <div className="relative aspect-square">
                {img.status === "uploading" && (
                  <Skeleton className="absolute inset-0 z-10 rounded-xl bg-neutral-800/80" />
                )}

                {img.status === "failed" && (
                  <div className="bg-destructive/80 absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl p-2 text-center text-white">
                    <IconPhotoExclamation className="h-8 w-8" />
                    <span className="text-xs">Upload failed</span>
                    {onRetry && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-white hover:text-white"
                        onClick={() => onRetry(img.clientId)}
                      >
                        <IconLoader2 className="mr-1 h-3 w-3 animate-spin" />
                        Retry
                      </Button>
                    )}
                  </div>
                )}

                {img.status === "uploaded" && (
                  <div className="bg-success/20 absolute inset-0 z-10 flex items-center justify-center rounded-xl">
                    <IconCheck className="text-success h-8 w-8" />
                  </div>
                )}

                {/* Updated image display logic */}
                <div className="relative h-full w-full">
                  {img.url.startsWith("blob:") ? (
                    // Use regular img tag for blob URLs
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.url}
                      alt="Upload preview"
                      className={cn(
                        "h-full w-full rounded-xl border object-cover dark:border-neutral-800",
                        img.status !== "uploaded" && "opacity-75",
                      )}
                    />
                  ) : (
                    // Use Next.js Image for normal URLs
                    <Image
                      src={img.url}
                      alt="Upload preview"
                      fill
                      className={cn(
                        "rounded-xl border object-cover dark:border-neutral-800",
                        img.status !== "uploaded" && "opacity-75",
                      )}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>

                {img.status === "uploading" && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <IconLoader2 className="h-5 w-5 animate-spin text-white duration-500" />
                  </div>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

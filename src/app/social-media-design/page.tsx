"use client";

import SocialMediaDesignOptions from "#/components/social-media-designs/options";
import { Button } from "#/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const SocialMediaDesign = () => {
  const router = useRouter();

  return (
    <div className="relative h-screen overflow-x-hidden pb-16 dark:bg-black">
      <div className="fixed top-0 z-50 w-full bg-gradient-to-b from-black to-transparent px-4 py-1 backdrop-blur-sm">
        <Button
          onClick={() => router.back()}
          size={"icon"}
          variant={"secondary"}
        >
          <IconChevronLeft width={24} className="h-6 w-6" />
        </Button>
      </div>
      <div className="pt-16"></div>
      {/* <CarouselShowoff /> */}
      <SocialMediaDesignOptions />
    </div>
  );
};

export default SocialMediaDesign;

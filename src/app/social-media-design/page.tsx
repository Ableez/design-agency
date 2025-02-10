"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "#/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "#/components/ui/button";
import { v4 } from "uuid";
import {
  IconArrowLeft,
  IconBrandFacebookFilled,
  IconBrandInstagramFilled,
  IconBrandSnapchatFilled,
  IconBrandTiktokFilled,
  IconClock,
  IconDiamondFilled,
  IconShare2,
  IconStarFilled,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import type { JobData } from "#/types/jobs";

const stories = [
  "https://i.pinimg.com/736x/dc/26/c5/dc26c5d8a8b2254b4bcc5c6a48ed0eb1.jpg",
  "https://i.pinimg.com/736x/47/d8/66/47d8664e7426416888d837969a2dd832.jpg",
  "https://i.pinimg.com/736x/ec/13/39/ec/1339af7087678f6ddf653be3edd880.jpg",
  "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2ejybTJwDKA7x5dpEl9tXuZzysigv1P0HGQIoJ",
  "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2enyN1XL2Hev178sr9kRZ6205EBnYdpclV3TqW",
  "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2ezkTi5QOaGxtUsVSORL3mHE2ADC5b8dc7whl0",
  "https://b4b43dszid.ufs.sh/f/wGHSFKxTYo2eR7j6zUJyuGiFdea2YtlVjTNx7vmUkP80JKbI",
  "https://i.pinimg.com/736x/21/a1/e9/21a1e9700c2befaf7a9453600ace0292.jpg",
];

interface SelectableOption {
  title: string;
  icon?: React.ReactNode;
  image?: string;
  description?: string;
  featured?: boolean;
}

export interface SocialFormState extends JobData {
  size: string | null;
  purpose: string | null;
  platform: string | null;
  deliverySpeed: string | null;
}

const SocialMediaDesign = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["jobs"]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const [socialFormState, setSocialFormState] =
    useState<SocialFormState | null>(null);

  const isFormComplete = !!(
    socialFormState?.size &&
    socialFormState?.purpose &&
    socialFormState?.platform &&
    socialFormState?.deliverySpeed
  );

  const handleLoadSaved = useCallback(() => {
    if (!isClient) return;

    try {
      const storedState = localStorage.getItem("socialMediaFormState");
      if (storedState) {
        setSocialFormState(JSON.parse(storedState) as SocialFormState);
      }
    } catch (error) {
      console.error("Failed to parse stored state:", error);
      localStorage.removeItem("socialMediaFormState"); // Clear invalid data
      setSocialFormState(null);
    } finally {
      setHasUnsavedChanges(false);
    }
  }, [isClient]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (socialFormState) {
        e.preventDefault(); // For modern browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload); // Clean up
    };
  }, [socialFormState]);

  useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    const localState = localStorage.getItem("socialMediaFormState");
    const storedState = localState
      ? (JSON.parse(localState) as SocialFormState)
      : null; // null if invalid

    if (storedState !== null) {
      console.log("STORED", storedState);

      setHasUnsavedChanges(true);
      toast("Unsaved changes restored from local storage", {
        action: <Button onClick={() => handleLoadSaved()}>Restore</Button>,
        duration: 3000,
      });
    }
  }, [handleLoadSaved, isClient]);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem(
      "socialMediaFormState",
      JSON.stringify(socialFormState),
    );
  }, [socialFormState, isClient]);

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

  const handleSelect = useCallback(
    (key: keyof SocialFormState, value: string) => {
      setSocialFormState((prevState) => {
        return { ...(prevState ?? {}), [key]: value } as SocialFormState;
      });
    },
    [],
  );

  const handleContinue = useCallback(async () => {
    if (!isFormComplete) {
      toast.error("Please complete all selections before continuing.");
      return;
    }

    toast.success("Creating your design request...");

    const jobId = v4();

    console.log("cookies.jobs", cookies.jobs);

    const oldJobs = cookies.jobs
      ? (JSON.parse(cookies.jobs as string) as JobData[])
      : [];

    const newJob: JobData = {
      ...socialFormState,
      jobId,
      timestamp: new Date().toISOString(),
      service: "Social media design",
      designDescription: "",
      referenceImages: [],
      designFiles: [],
      userInfo: {
        username: "",
        email: "",
        phone: "",
        brand: "",
      },
    };

    setCookie("jobs", JSON.stringify([...oldJobs, newJob]), {
      path: "/",
      maxAge: 3600,
    });

    router.push(`/design-info/${jobId}`);
  }, [socialFormState, setCookie, router, cookies.jobs, isFormComplete]);

  const sizeOptions: SelectableOption[] = [
    { title: "Square 1/1" },
    { title: "Reels 9/16" },
  ];

  const purposeOptions: SelectableOption[] = [
    {
      image:
        "https://i.pinimg.com/474x/0b/a6/f1/0ba6f158707462f47f02b231e30dbbc1.jpg",
      title: "Promotion",
    },
    {
      image:
        "https://i.pinimg.com/736x/18/22/9a/18229ab5c6a0f488cac88e51fd80442f.jpg",
      title: "Product display",
    },
    {
      image:
        "https://i.pinimg.com/736x/f8/95/89/f895894a5535252fcf8867b136c91f1c.jpg",
      title: "Infographics",
    },
    {
      image:
        "https://i.pinimg.com/736x/2f/e0/72/2fe0721ad4f523fe132eda6c1b8d2905.jpg",
      title: "Custom idea",
    },
  ];

  const platformOptions: SelectableOption[] = [
    {
      title: "Instagram",
      icon: <IconBrandInstagramFilled size={24} color={"#eb0000"} />,
    },
    {
      title: "Facebook",
      icon: <IconBrandFacebookFilled size={24} color={"#004eed"} />,
    },
    {
      title: "TikTok",
      icon: <IconBrandTiktokFilled size={24} color={"#fff"} />,
    },
    {
      title: "Snapchat",
      icon: <IconBrandSnapchatFilled size={24} color={"#eb0"} />,
    },
  ];

  const deliverySpeedOptions: SelectableOption[] = [
    {
      title: "Express",
      icon: <IconTruckDelivery size={28} color={"#eb0"} />,
      description: "Get it in 24hrs",
      featured: true,
    },
    {
      title: "Standard",
      icon: <IconClock size={30} color={"#004eed"} />,
      description: "Delivery time: 2-3 days",
      featured: false,
    },
  ];

  return (
    <div className="relative h-screen overflow-x-hidden bg-white dark:bg-black">
      <div className="fixed left-0 top-0 z-[60] flex w-full place-items-center items-center justify-between bg-gradient-to-b from-black/80 via-black/50 to-transparent p-2 align-middle">
        <Button onClick={() => router.back()} size={"icon"} variant={"outline"}>
          <IconArrowLeft size={24} color={"#fff"} />
        </Button>

        <div className={"flex place-items-center gap-2 align-middle"}>
          <Button size={"icon"} variant={"secondary"}>
            <IconShare2 size={24} color={"#fff"} />
          </Button>
          <Button>
            <IconDiamondFilled size={24} color={"#fff"} />
            <h4>Add to plan</h4>
          </Button>
        </div>
      </div>
      <div className="sticky -top-2 left-0 h-[60dvh] w-full overflow-clip">
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

      <div className="relative flex min-h-[40dvh] w-full -translate-y-[10dvh] flex-col gap-6 rounded-t-2xl bg-white p-6 shadow-2xl dark:bg-black">
        <div className="flex flex-col gap-2">
          <h4 className="pl-2 text-xs font-medium dark:text-neutral-600">
            Choose your size
          </h4>
          <div className="flex gap-4">
            {sizeOptions.map((option) => (
              <button
                key={option.title}
                className={`flex w-full place-items-center gap-4 rounded-2xl p-4 align-middle ring-2 ${
                  socialFormState?.size === option.title
                    ? "ring-4 ring-blue-500 dark:hover:ring-blue-500"
                    : "ring-transparent"
                } dark:bg-neutral-900 dark:hover:ring-blue-600/40`}
                onClick={() => handleSelect("size", option.title)}
              >
                <div className="aspect-square w-12 rounded-sm border dark:border-neutral-700" />
                <h4>{option.title}</h4>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="pl-2 text-xs font-medium dark:text-neutral-600">
            Purpose
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {purposeOptions.map((option) => (
              <button
                key={option.title}
                className={`flex w-full flex-col place-items-center gap-4 rounded-2xl p-4 align-middle ring-2 ${
                  socialFormState?.purpose === option.title
                    ? "ring-4 ring-blue-500 dark:hover:ring-blue-500"
                    : "ring-transparent"
                } dark:bg-neutral-900 dark:hover:ring-blue-600/40`}
                onClick={() => handleSelect("purpose", option.title)}
              >
                <Image
                  src={option.image!}
                  alt={option.title}
                  width={120}
                  className="aspect-square w-full rounded-xl object-cover"
                  height={120}
                />
                <h4>{option.title}</h4>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="pl-2 text-xs font-medium dark:text-neutral-600">
            Platform
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {platformOptions.map((option) => (
              <button
                key={option.title}
                className={`flex w-full place-items-center gap-4 rounded-2xl p-4 align-middle ring-2 ${
                  socialFormState?.platform === option.title
                    ? "ring-4 ring-blue-500 dark:hover:ring-blue-500"
                    : "ring-transparent"
                } dark:bg-neutral-900 dark:hover:ring-blue-600/40`}
                onClick={() => handleSelect("platform", option.title)}
              >
                {option.icon}
                <h4>{option.title}</h4>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="pl-2 text-xs font-medium dark:text-neutral-600">
            How fast do you need it?
          </h4>
          <div className="grid grid-rows-2 gap-4">
            {deliverySpeedOptions.map((option) => (
              <button
                key={option.title}
                className={`relative flex w-full place-items-start gap-4 rounded-2xl ${
                  socialFormState?.deliverySpeed === option.title
                    ? "ring-4 ring-blue-500 dark:hover:ring-blue-500"
                    : "ring-transparent"
                } px-6 py-4 dark:bg-neutral-900 dark:hover:ring-blue-600/40`}
                onClick={() => handleSelect("deliverySpeed", option.title)}
              >
                {option.icon}
                <div className="flex flex-col text-left">
                  <h4>{option.title}</h4>
                  <h4 className="text-xs text-neutral-500">
                    {option.description}
                  </h4>
                </div>
                {option.featured && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <IconStarFilled color="#eb0" size={16} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 z-50 w-full bg-gradient-to-t from-black to-transparent px-8 py-4">
        <Button
          onClick={async () => {
            await handleContinue();
          }}
          className="w-full"
          disabled={!isFormComplete}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaDesign;

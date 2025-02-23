"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  designDeliveryOptions,
  designSizeOptions,
  DesignSizeType,
  instagramDesignSizeOptions,
  platformOptions,
  purposeOptions,
  SocialFormState,
} from "./data";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { v4 } from "uuid";
import { DesignJobData } from "#/types/jobs";
import DeliveryOptionPicker from "../design-delivery-option-picker";
import DesignSizeOptionPicker from "../design-size-option-picker";

type Props = {};

const SocialMediaDesignOptions = (props: Props) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [socialFormState, setSocialFormState] =
    useState<SocialFormState | null>(null);
  const [currSizeOptions, setCurrSizeOptions] = useState<
    DesignSizeType[] | null
  >(null);

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
    localStorage.setItem(
      "socialMediaFormState",
      JSON.stringify(socialFormState),
    );
  }, [socialFormState, isClient]);

  const handleSelect = useCallback(
    (key: keyof SocialFormState, value: string) => {
      setSocialFormState((prevState) => {
        return { ...(prevState ?? {}), [key]: value } as SocialFormState;
      });
    },
    [],
  );

  const handleSetSizeOption = useCallback(
    (platform: keyof typeof designSizeOptions) => {
      const size = designSizeOptions[platform];
      if (size) {
        setCurrSizeOptions(size);
      }
    },
    [],
  );

  const isFormComplete = !!(
    socialFormState?.size &&
    socialFormState?.purpose &&
    socialFormState?.platform &&
    socialFormState?.designDeliveryOption
  );

  console.log("CHECKUP", {
    size: !!socialFormState?.size,
    purpose: !!socialFormState?.purpose,
    platform: !!socialFormState?.platform,
    designDeliveryOption: !!socialFormState?.designDeliveryOption,
  });

  const handleContinue = useCallback(async () => {
    if (!isFormComplete) {
      toast.error("Please complete all selections before continuing.");
      return;
    }

    toast.success("Creating your design request...");

    const jobId = v4();

    const newJob: DesignJobData = {
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
    sessionStorage.setItem(jobId, JSON.stringify(newJob));

    router.push(`/design-info/${jobId}`);
  }, [socialFormState, router, isFormComplete]);

  console.log("socialFormState", socialFormState);

  return (
    <div>
      <div className="relative flex min-h-[100dvh] w-full flex-col gap-6 rounded-t-2xl bg-white p-4 py-2 pb-20 shadow-2xl dark:bg-black">
        <div className="flex flex-col gap-2">
          <h4 className="pl-2 text-xs font-medium dark:text-neutral-600">
            Platform
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {platformOptions.map((option) => (
              <button
                key={option.title}
                className={`flex w-full place-items-center gap-4 rounded-2xl p-4 align-middle ring-2 ${
                  socialFormState?.platform === option.id
                    ? "ring-4 ring-blue-500 dark:hover:ring-blue-500"
                    : "ring-transparent"
                } dark:bg-neutral-900 dark:hover:ring-blue-600/40`}
                onClick={() => {
                  handleSelect("platform", option.id);
                  handleSetSizeOption(option.id);
                }}
              >
                {/* {option.icon} */}
                <h4 className="text-center text-xs font-semibold md:text-sm">
                  {option.title}
                </h4>
              </button>
            ))}
          </div>
        </div>

        <DesignSizeOptionPicker
          designSizeOptions={currSizeOptions ?? instagramDesignSizeOptions}
          label="Pick a size"
          selectedOption={socialFormState?.size ?? null}
          onSelect={(s) =>
            setSocialFormState((p) => ({ ...p, size: s }) as SocialFormState)
          }
        />
        <div className="flex flex-col gap-2">
          <h4 className="pl-2 text-xs font-medium dark:text-neutral-600">
            Use case
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
                <h4 className="text-xs md:text-sm">{option.title}</h4>
              </button>
            ))}
          </div>
        </div>

        <DeliveryOptionPicker
          designDeliveryOptions={designDeliveryOptions}
          selectedOption={socialFormState?.designDeliveryOption ?? null}
          onSelect={(s) =>
            setSocialFormState(
              (p) => ({ ...p, designDeliveryOption: s }) as SocialFormState,
            )
          }
        />
      </div>
      <div className="fixed bottom-0 left-0 z-50 w-full bg-gradient-to-t from-black to-transparent px-4 py-6">
        <Button
          onClick={async () => {
            await handleContinue();
          }}
          className="w-full hover:bg-blue-500 disabled:bg-neutral-600 disabled:opacity-100"
          disabled={!isFormComplete}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaDesignOptions;

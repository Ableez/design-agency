"use client";

import DesignDeliveryOptionPicker from "#/components/design-delivery-option-picker";
import DeliveryOptionPicker from "#/components/design-delivery-option-picker";
import DesignInfoForm from "#/components/design-info/design-info-form";
import {
  designDeliveryOptions,
  DesignDeliveryOptionType,
  SocialFormState,
} from "#/components/social-media-designs/data";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "#/components/ui/drawer";
import type { DesignJobData } from "#/types/jobs";
import {
  IconInfoCircleFilled,
  IconTruckDelivery,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import { toast } from "sonner";

interface Props {
  params: Promise<{ jobId: string }>;
}

const DesignInfo = ({ params }: Props) => {
  const { jobId } = use(params);
  const jobsCookie = sessionStorage.getItem(jobId);
  const jobFormState = JSON.parse(jobsCookie ?? "{}") as DesignJobData;
  const [delivery, setDelivery] = useState<DesignDeliveryOptionType | null>(
    null,
  );
  const [openDeliveryDrawer, setOpenDeliveryDrawer] = useState(false);

  if (!jobsCookie) {
    return <ErrorMessage />;
  }

  try {
    const jobInfo = jobFormState as DesignJobData;

    return (
      <div className="container mx-auto max-w-2xl bg-white dark:bg-black">
        <header className="sticky top-0 mb-4 flex items-center justify-between bg-black/60 px-4 py-4 backdrop-blur-xl z-50">
          <div className="flex items-center gap-2">
            <Link
              href={`/${jobInfo.service.toLocaleLowerCase().replaceAll(" ", "-")}`}
            >
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                aria-label="Close"
              >
                <IconX className="h-6 w-6 text-blue-500" strokeWidth={3} />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Your order</h1>
          </div>

          <Drawer>
            <DrawerTrigger>
              <Button variant="secondary" className="flex items-center gap-2">
                <IconInfoCircleFilled className="h-6 w-6 text-blue-500" />
                <span>Help</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Help</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col gap-2 p-6 pb-16 text-sm font-medium dark:text-neutral-500">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                  architecto velit dolore assumenda tempore ipsa nisi porro?
                  Eligendi, dolores dolor.
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Eligendi quo fugiat voluptatem quas possimus autem aliquid
                  soluta eaque facere aperiam earum ipsa, iste voluptate dicta
                  optio accusamus ducimus consequuntur exercitationem, voluptas
                  nisi? Quas alias omnis.
                </p>
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Perspiciatis, voluptatem.
                </p>
              </div>
            </DrawerContent>
          </Drawer>
        </header>

        <h2 className="mb-6 max-w-xs pl-6 text-3xl font-bold">
          Just one more step
        </h2>

        {/* Summary Card */}
        <Card className="mx-4 mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold text-neutral-500">Summary</h2>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <div className="font-medium">{jobInfo.service}</div>
              <div className="text-sm lowercase text-neutral-400 first-letter:capitalize">
                <div className="mb-1 flex w-full place-items-center justify-between gap-4 rounded-sm align-middle">
                  <h4 className="font-medium capitalize text-neutral-600">
                    Platform
                  </h4>
                  <h4 className="justify-self-endfont-medium flex w-[170px] place-items-center gap-2 rounded-sm p-1 px-3 align-middle capitalize dark:bg-neutral-800">
                    <Image
                      src={`/${jobInfo.platform.toLowerCase()}.svg`}
                      alt={jobInfo.platform}
                      width={16}
                      height={16}
                    />
                    {jobInfo.platform}
                  </h4>
                </div>
                <div className="mb-1 flex w-full place-items-center justify-between gap-4 rounded-sm align-middle">
                  <h4 className="font-medium capitalize text-neutral-600">
                    Use case
                  </h4>
                  <h4 className="w-[170px] justify-self-end rounded-sm p-1 px-3 font-medium capitalize dark:bg-neutral-800">
                    {jobInfo.purpose}
                  </h4>
                </div>
                <div className="mb-1 flex w-full place-items-center justify-between gap-4 rounded-sm align-middle">
                  <h4 className="font-medium capitalize text-neutral-600">
                    Size
                  </h4>
                  <h4 className="justify-self-endfont-medium w-[170px] rounded-sm p-1 px-3 capitalize dark:bg-neutral-800">
                    {jobInfo.size?.title}
                    <span> · </span>
                    <span>{jobInfo.size?.aspectRatio}</span>
                  </h4>
                </div>

                <div className="mb-1 flex w-full place-items-center justify-between gap-4 align-middle">
                  <h4 className="font-medium capitalize text-neutral-600">
                    Dimensions
                  </h4>
                  <h4 className="w-[170px] justify-self-end rounded-sm p-1 px-3 font-medium capitalize dark:bg-neutral-800">
                    <span>{jobInfo.size?.dimensions}</span>
                  </h4>
                </div>
                {jobInfo.size?.description && (
                  <div className="mb-1 flex w-full place-items-center justify-between gap-4 rounded-sm p-1 pl-4 align-middle dark:bg-neutral-800">
                    <h4 className="font-medium capitalize text-neutral-600">
                      {jobInfo.size?.description ?? "No description"}
                    </h4>
                  </div>
                )}
              </div>

              <div className="mb-1 flex w-full place-items-center justify-between gap-4 align-middle">
                <h4 className="text-sm font-medium capitalize text-neutral-600">
                  Delivery
                </h4>
                <Drawer
                  open={openDeliveryDrawer}
                  onOpenChange={setOpenDeliveryDrawer}
                >
                  <DrawerTrigger asChild>
                    <button className="flex cursor-pointer place-items-center justify-center gap-2 justify-self-end rounded-sm p-1 px-3 align-middle text-sm font-medium capitalize text-neutral-400 transition-all duration-100 ease-out hover:scale-[0.98] dark:bg-neutral-800">
                      <IconTruckDelivery width={18} color={"#008aff"} />
                      <h4>
                        {delivery?.title ?? jobInfo.designDeliveryOption?.title}
                      </h4>
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Change delivery</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-16">
                      <DesignDeliveryOptionPicker
                        designDeliveryOptions={designDeliveryOptions}
                        onSelect={(d) => {
                          setDelivery(d);
                          setOpenDeliveryDrawer(false);
                          toast(`Delivery option changed to ${d.title}`);
                        }}
                        selectedOption={delivery}
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Design Preferences Section */}
        <section className="mb-8 px-4">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <p className="text-sm text-neutral-400">
                  Describe your design preferences in detail. The more
                  information you provide, the better we can tailor the design
                  to your needs.
                </p>
              </div>
              <DesignInfoForm
                jobInfo={{ ...jobInfo, designDeliveryOption: delivery }}
                jobId={jobId}
              />
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="p-4 pb-10 text-center">
          <p className="text-sm text-neutral-400">
            You can always talk to us if you have any questions or changes in
            mind.{" "}
            <Link
              href="terms"
              className="text-blue-500 underline-offset-2 hover:underline"
            >
              Terms and conditions
            </Link>{" "}
            apply
          </p>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Error parsing jobs cookie:", error);
    return <ErrorMessage />;
  }
};

const ErrorMessage = () => (
  <div className="mx-auto mt-14 max-w-[90dvw] rounded-2xl p-8 text-xl dark:bg-neutral-800">
    Seems like we cant find what you are looking for
  </div>
);

export default DesignInfo;

"use client";

import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { IconDiamondFilled } from "@tabler/icons-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "#/trpc/react";
import { BrandSelect } from "#/server/db/schema-types";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const formSchema = z.object({
  brand: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinished: (data: BrandSelect & { error: string | null }) => void;
  handleDeliveryEmailChange: (email: string) => void;
  deliveryEmail: string | null;
};

const BrandCreatorDrawer = ({
  open,
  onOpenChange,
  onFinished,
  handleDeliveryEmailChange,
  deliveryEmail,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const { isSignedIn, user } = useUser();

  const { mutateAsync: createBrand, isPending: isLoading } =
    api.brand.create.useMutation({
      onError: (error) => {
        toast.error("Failed to create brand: " + error.message);
      },
    });
  const [existingBrand, setExistingBrand] = useState<BrandSelect | null>(null);

  const onSubmit = async (data: FormValues) => {
    if (!isSignedIn && !deliveryEmail) {
      toast("We are gonna need your email too.");
      return;
    }

    const res = await createBrand({
      name: data.brand,
      industry: data.industry,
      email: user?.emailAddresses[0]?.emailAddress ?? deliveryEmail!,
    });

    console.log("RES", res);

    if (res?.error === "Brand already exists") {
      setExistingBrand(res as BrandSelect & { error: string | null });
      toast(res?.error);
      return;
    } else {
      toast("🥂🎉Brand created!");
      onOpenChange(false);
      reset();
      onFinished(res as BrandSelect & { error: string | null });
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Lets get to know you</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          {existingBrand && (
            <div className="mb-2 flex cursor-pointer place-items-center justify-between gap-3 rounded-2xl bg-gradient-to-r p-2 px-4 align-middle text-sm font-medium dark:from-blue-950/30 dark:to-purple-950/30">
              <div className="flex place-items-center justify-center gap-2 rounded-full align-middle">
                <Image
                  src={existingBrand.logo ?? "/favicon.png"}
                  alt="Brand logo"
                  width={30}
                  height={30}
                  className="opacity-60 grayscale"
                />
                <h4 className="text-lg font-semibold capitalize">
                  {existingBrand.name}
                </h4>
              </div>
              <Button
                onClick={() => {
                  onFinished(
                    existingBrand as BrandSelect & { error: string | null },
                  );
                  toast("😎 Fresh");
                  onOpenChange(false);
                  reset();
                }}
                variant={"ghost"}
                className="px-4 py-1"
              >
                Use it
              </Button>
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-[40dvh] flex-col gap-2.5 pb-10"
          >
            <div>
              <Label className="flex place-items-center justify-center gap-1 pb-3 pl-2 text-center align-middle text-xs dark:text-neutral-400">
                <IconDiamondFilled color={"#008aff"} width={16} />
                Your brand name
              </Label>
              <div className="relative h-14 w-full">
                <div className="absolute left-0 top-0 h-9 w-full rounded-xl bg-gradient-to-br from-blue-600 to-purple-500 opacity-70 blur-sm" />
                <Input
                  {...register("brand")}
                  id="brand"
                  placeholder="Type here..."
                  className="absolute left-0 top-0 rounded-xl text-sm dark:bg-black"
                />
                {errors.brand && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.brand.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full border-b dark:border-neutral-700" />
            <div>
              <Label className="mb-2 pl-2 text-xs dark:text-neutral-400">
                Business category (e.g. Fashion, Technology, etc.)
              </Label>
              <Input
                {...register("industry")}
                placeholder="Type here..."
                className="text-sm"
              />
              {errors.industry && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>
            {!isSignedIn && (
              <div>
                <Label className="mb-2 pl-2 text-xs dark:text-neutral-400">
                  Your email (We will your design here)
                </Label>
                <Input
                  onChange={(e) => handleDeliveryEmailChange(e.target.value)}
                  value={deliveryEmail ?? ""}
                  placeholder="Type here..."
                  className="text-sm"
                />
                {errors.industry && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.industry.message}
                  </p>
                )}
              </div>
            )}
            <Button type="submit" className="mt-4" disabled={isLoading}>
              {isLoading ? "Creating..." : "Complete order"}
            </Button>
          </form>
          <p className="pb-3 text-center text-xs dark:text-neutral-500">
            If you are a nerd🤓. You might wanna read our{" "}
            <Link className="font-semibold text-blue-600" href={"/terms"}>
              terms and policies here
            </Link>
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BrandCreatorDrawer;

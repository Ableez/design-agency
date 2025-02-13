"use client";

import React from "react";
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

const formSchema = z.object({
  brand: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinished: (data: BrandSelect) => void;
};

const BrandCreatorDrawer = ({ open, onOpenChange, onFinished }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: createBrand, isPending: isLoading } =
    api.brand.create.useMutation({
      onSuccess: () => {
        toast.success("Brand created successfully!");
        onOpenChange(false);
        reset();
      },
      onError: (error) => {
        toast.error("Failed to create brand: " + error.message);
      },
    });

  const onSubmit = async (data: FormValues) => {
    const res = await createBrand({
      name: data.brand,
      industry: data.industry,
    });

    if (res) {
      onFinished(res);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Lets get to know you</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
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

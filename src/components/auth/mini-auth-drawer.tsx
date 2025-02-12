"use client";

import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { IconDiamondFilled } from "@tabler/icons-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MiniAuthDrawer = ({ open, onOpenChange }: Props) => {
  const [formState, setFormState] = useState<{
    username: string;
    email: string;
    brand: string;
  }>({
    username: "",
    email: "",
    brand: "",
  });

  const pathName = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Drawer open={true} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Lets get to know you</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!formState) {
                toast("Sorry we need all the info😅");
              }
              // const { data, error } = await authClient.signIn.magicLink({
              //   email: formState?.email as string,
              //   callbackURL: pathName,
              // });

              // console.log("data", data);
              // console.log("error", error);
            }}
            className="flex min-h-[60dvh] flex-col gap-2.5 pb-10"
          >
            <div>
              <Label className="flex place-items-center justify-center gap-1 pb-3 pl-2 text-center align-middle text-xs dark:text-neutral-400">
                <IconDiamondFilled color={"#008aff"} width={16} />
                Your brand name
              </Label>
              <div className="relative h-14 w-full">
                <div className="absolute left-0 top-0 h-9 w-full rounded-xl bg-gradient-to-br from-blue-600 to-purple-500 opacity-50 blur-sm" />
                <Input
                  name="brand"
                  required
                  id={"brand"}
                  placeholder="Type here..."
                  className="absolute left-0 top-0 rounded-xl text-sm dark:bg-black"
                  value={formState?.brand}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="w-full border-b dark:border-neutral-700" />
            <div>
              <Label className="pl-2 text-xs dark:text-neutral-400">
                Your name
              </Label>
              <Input
                name="username"
                required
                placeholder="Type here..."
                className="text-sm"
                value={formState?.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="pl-2 text-xs dark:text-neutral-400">
                Your email
              </Label>
              <Input
                name="email"
                required
                placeholder="Type here..."
                className="text-sm"
                value={formState?.email}
                onChange={handleChange}
              />
            </div>
            <Button className="mt-4">Complete order</Button>
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

export default MiniAuthDrawer;

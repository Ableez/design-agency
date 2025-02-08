import React from "react";
import { Button } from "#/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#/components/ui/sheet";
import {
  IconAsterisk,
  IconBriefcase,
  IconColorSwatch,
  IconDiamondFilled,
  IconMenu,
  IconWallet,
} from "@tabler/icons-react";

const Header = () => {
  return (
    <div className="fixed top-0 z-[99999] grid w-full grid-cols-3 place-items-center justify-between bg-gradient-to-b from-black to-transparent px-4 py-4 align-middle md:hidden">
      <div className="flex w-full justify-start">
        <Sheet>
          <SheetTrigger asChild>
            <Button size={"icon"} variant={"outline"} className="m-0">
              <IconMenu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="z-[999999] p-2 py-4">
            <SheetHeader>
              <SheetTitle>Asterisk</SheetTitle>
            </SheetHeader>

            <div className="mt-4 flex place-items-center gap-4 px-2 py-2 align-middle">
              <div className="h-[100px] w-full cursor-pointer rounded-2xl bg-gradient-to-br p-2 ring-2 ring-transparent transition-all duration-300 ease-in-out dark:from-blue-600/20 dark:to-blue-900/20 dark:hover:to-blue-600/20 dark:hover:ring-blue-600/50">
                <h4 className="text-xs font-semibold text-blue-200">Jobs</h4>
              </div>
            </div>
            <div className="py-4">
              <SheetClose asChild>
                <Button variant={"ghost"} className="w-full justify-start py-6">
                  <IconWallet />
                  <h4>Payments</h4>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant={"ghost"} className="w-full justify-start py-6">
                  <IconColorSwatch />
                  <h4>My designs</h4>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant={"ghost"} className="w-full justify-start py-6">
                  <IconDiamondFilled />
                  <h4>My brand</h4>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant={"ghost"} className="w-full justify-start py-6">
                  <IconBriefcase />
                  <h4>Jobs history</h4>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex place-items-center items-center gap-2 align-middle">
        <IconAsterisk strokeWidth={4} color={"#fff"} size={38} />
        <h4 className="hidden text-lg font-semibold md:block">Asterisk</h4>
      </div>
      <div className="w-10" />
    </div>
  );
};

export default Header;

"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#/components/ui/sheet";
import {
  IconBriefcase,
  IconColorSwatch,
  IconDiamondFilled,
  IconLogout2,
  IconMenu,
  IconWallet,
} from "@tabler/icons-react";
import { Button } from "./ui/button";
import { authClient } from "#/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

const MobileSheet = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full justify-start">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size={"icon"} variant={"outline"} className="m-0">
            <IconMenu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-2 py-4">
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

          <div className="mt-8">
            <SheetClose asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-center py-5"
                  >
                    <IconLogout2 color={"#eb0000"} />
                    <h4 className="text-red-600">Sign out</h4>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be signed out of your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          const data = await authClient.signOut();
                          console.log(data.data);
                        }}
                      >
                        Sign out
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSheet;

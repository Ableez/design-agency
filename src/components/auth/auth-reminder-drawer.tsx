"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import Link from "next/link";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";

const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours

const AuthReminderDrawer = () => {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      setOpen(false);
      return;
    }

    const hasSeen = localStorage.getItem("hasSeenAuthReminder") === "true";
    const lastSeen =
      parseInt(localStorage.getItem("seenReminderAt") ?? "0") || 0;
    const shouldShow = !hasSeen || Date.now() - lastSeen > COOLDOWN_PERIOD;

    if (shouldShow) setOpen(true);
  }, [isSignedIn]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      localStorage.setItem("hasSeenAuthReminder", "true");
      localStorage.setItem("seenReminderAt", Date.now().toString());
    }
    setOpen(isOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>You haven't logged in yet</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-16">
          <Link href="/sign-in" className="w-full">
            <DrawerClose asChild>
              <Button className="w-full">Sign in</Button>
            </DrawerClose>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const ControlledAuthReminder = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const handleChange = (isOpen: boolean) => {
    if (!isOpen) {
      localStorage.setItem("hasSeenAuthReminder", "true");
      localStorage.setItem("seenReminderAt", Date.now().toString());
    }
    onOpenChange?.(isOpen);
  };

  return (
    <Drawer open={open} onOpenChange={handleChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>You haven't logged in yet</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-16">
          <Link href="/sign-in" className="w-full">
            <DrawerClose asChild>
              <Button className="w-full">Sign in</Button>
            </DrawerClose>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AuthReminderDrawer;

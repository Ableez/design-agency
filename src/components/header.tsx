import React from "react";
import { IconAsterisk } from "@tabler/icons-react";
import Link from "next/link";
import MobileSheet from "./mobile-sheet";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <div className="fixed top-0 z-[39] grid w-full grid-cols-3 place-items-center justify-between bg-gradient-to-b from-black to-transparent px-4 py-4 align-middle md:hidden">
      <MobileSheet />
      <Link
        href={"/"}
        className="flex place-items-center items-center gap-2 align-middle"
      >
        <IconAsterisk strokeWidth={4} color={"#fff"} size={38} />
        <h4 className="hidden text-lg font-semibold md:block">Asterisk</h4>
      </Link>
      <div  className="justify-self-end">
        <UserButton />
      </div>
    </div>
  );
};

export default Header;

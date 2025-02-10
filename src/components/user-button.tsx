import React from "react";
import { Button } from "./ui/button";
import { auth } from "#/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const UserButton = async () => {
  const user = await auth.api.getSession({ headers: await headers() });

  return (
    <Link href={"/profile"} className={"justify-self-end"}>
      <button className="flex aspect-square place-items-center items-center gap-2 overflow-clip rounded-2xl align-middle transition-all duration-150 ease-in-out hover:scale-[0.98]">
        <Image
          src={user?.user.image ?? "/asterisk.svg"}
          alt={"DP"}
          width={44}
          height={44}
        />
      </button>
    </Link>
  );
};

export default UserButton;

import { headers } from "next/headers";
import Services from "./services";
import { Spotlight } from "./spotlight-bg";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import SendMail from "./send-mail";

export default async function HomeHero() {
  const user = await currentUser();

  return (
    <div className="bg-grid-white/[0.02] relative flex w-full flex-col overflow-hidden bg-black/[0.96] py-10 antialiased md:items-center md:justify-center">
      <Spotlight />
      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 py-10 pt-20 text-center md:pt-0">
        <h4 className="mb-1 bg-gradient-to-r from-blue-700 via-purple-600 to-red-600 bg-clip-text text-4xl font-semibold text-transparent">
          Hello,{" "}
          <Link
            className="transition-all duration-150 ease-in-out hover:scale-[0.95]"
            href={user ? "/profile" : "/sign-in"}
          >
            {user?.username ?? "User"}!
          </Link>
        </h4>
        <h4 className="dark:text-neutral-400">How can we help you today?</h4>
      </div>

      <SendMail />

      <Services />
    </div>
  );
}

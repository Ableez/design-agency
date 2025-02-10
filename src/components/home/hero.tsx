import { auth } from "#/lib/auth";
import { headers } from "next/headers";
import Services from "./services";
import { Spotlight } from "./spotlight-bg";
import Link from "next/link";

export default async function HomeHero() {
  const user = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="bg-grid-white/[0.02] relative flex w-full flex-col overflow-hidden bg-black/[0.96] py-10 antialiased md:items-center md:justify-center">
      <Spotlight />
      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 py-10 pt-20 text-center md:pt-0">
        <h4 className="mb-1 bg-gradient-to-r from-purple-700 via-blue-600 to-red-600 bg-clip-text text-4xl font-semibold text-transparent">
          Welcome,{" "}
          <Link
            className="transition-all duration-150 ease-in-out hover:scale-[0.95]"
            href={user ? "/profile" : "/sign-in"}
          >
            {user?.user?.name.split(" ")[0] ?? "User"}!
          </Link>
        </h4>
        <h4 className="dark:text-neutral-400">How can we help you today?</h4>
      </div>
      <Services />
    </div>
  );
}

"use client";

import Services from "./services";
import { Spotlight } from "./spotlight-bg";

export default function HomeHero() {
  return (
    <div className="bg-grid-white/[0.02] relative flex w-full flex-col overflow-hidden bg-black/[0.96] py-10 antialiased md:items-center md:justify-center">
      <Spotlight />
      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 py-10 pt-20 text-center md:pt-0">
        <h4 className="mb-1 bg-gradient-to-r from-purple-700 via-blue-600 to-red-600 bg-clip-text text-4xl font-semibold text-transparent">
          Welcome, Odd
        </h4>
        <h4 className="dark:text-neutral-400">How can we help you today?</h4>
      </div>
      <Services />
    </div>
  );
}

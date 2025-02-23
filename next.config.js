/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        hostname: "i.pinimg.com",
      },
      {
        hostname: "plus.unsplash.com",
      },
      {
        hostname: "utfs.io",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "b4b43dszid.ufs.sh",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default config;

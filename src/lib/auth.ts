import { db } from "#/server/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "better-auth/plugins/passkey";
import { phoneNumber } from "better-auth/plugins";
import { env } from "#/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ableez.vercel.app",
  logger: {
    level: "debug",
    log(level, message, ...args) {
      console.log(message);
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  trustedOrigins: [
    "https://31f0-102-88-84-32.ngrok-free.app",
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ableez.vercel.app",
  ],
  plugins: [
    passkey({
      rpID: "localhost",
      rpName: "Asterisk",
      origin:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://ableez.vercel.app",
    }),
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, request) => {
        //TODO: send OTP to phone number
      },
    }),
  ],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});

export type Providers =
  | "github"
  | "apple"
  | "discord"
  | "facebook"
  | "microsoft"
  | "google"
  | "spotify"
  | "twitch"
  | "twitter"
  | "dropbox"
  | "linkedin"
  | "gitlab"
  | "reddit";

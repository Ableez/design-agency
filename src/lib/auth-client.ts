import { passkeyClient } from "better-auth/plugins/passkey";
import { createAuthClient } from "better-auth/react";
import { phoneNumberClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ableez.vercel.app", // the base url of your auth server
  plugins: [passkeyClient(), phoneNumberClient()],
});

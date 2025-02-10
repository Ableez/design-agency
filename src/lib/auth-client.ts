import { passkeyClient } from "better-auth/plugins/passkey";
import { createAuthClient } from "better-auth/react";
import { phoneNumberClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // the base url of your auth server
  plugins: [passkeyClient(), phoneNumberClient()],
});

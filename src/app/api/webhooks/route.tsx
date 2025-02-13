import { Webhook } from "svix";
import { headers } from "next/headers";
import { env } from "#/env";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "#/server/db";
import { user } from "../../../server/db/schema";

type WebhookUntransformedEvt = {
  data: {
    email_addresses: {
      email_address: string;
      id: string;
      linked_to: unknown[];
      object: string;
      verification: {
        status: string;
        strategy: string;
      };
    }[];
    id: string;
    username: string;
    image_url: string;
    last_sign_in_at: number;
    created_at: number;
    updated_at: number;
  };
};

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint

  if (!env.WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  // Create a new Svix instance with your secret.
  const wh = new Webhook(env.WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  function handler(webhook: WebhookUntransformedEvt): {
    data: {
      id: string;
      username: string;
      createdAt: number;
      updatedAt: number;
      email: string | undefined;
      profile_image_url: string;
    };
  } {
    const returnType = {
      id: webhook.data.id,
      username: webhook.data.username,
      createdAt: webhook.data.created_at,
      updatedAt: webhook.data.updated_at,
      email: webhook.data.email_addresses[0]?.email_address,
      profile_image_url: webhook.data.image_url,
    };

    return { data: { ...returnType } };
  }

  const { data: evtData } = handler(evt as WebhookUntransformedEvt);

  switch (evt.type) {
    case "user.created":
      await db.insert(user).values({
        id: evtData.id,
        username: evtData.username ?? "username",
        email: evtData.email ?? "user@asteriskda.com",
        profileImageUrl: evtData.profile_image_url,
        createdAt: new Date(evtData.createdAt),
        updatedAt: new Date(evtData.updatedAt),
      });
      break;
    default:
      console.log(`Unhandled event type: ${evt.type}`);
  }

  return new Response("", { status: 200 });
}

"use server";

import { auth } from "#/lib/auth";
import { headers } from "next/headers";
import { db } from "../db";
import { designJob } from "../db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type SocialMediaDesignJobInput = {
  size: string;
  purpose: string;
  platform: string;
  deliverySpeed: string;
  jobId: string;
  timestamp: string;
  service: string;
  designDescription: string;
  referenceImages?: string[];
  designFiles?: string[];
  username: string;
  email: string;
  phone: string;
  brand: string;
};

export const createSocialMediaDesignJob = async (
  input: SocialMediaDesignJobInput,
) => {
  console.log("IN THE SERVER ", input);
  const user = await auth.api.getSession({ headers: await headers() });

  const created = await db
    .insert(designJob)
    .values({
      email: (user?.user?.email ?? input.email) ?? undefined,
      phone: (user?.user?.phoneNumber ?? input.phone) ?? undefined,
      brand: input.brand ?? undefined,
      username: (user?.user?.name ?? input.username) ?? undefined,
      deliverySpeed: input.deliverySpeed ?? undefined,
      designDescription: input.designDescription ?? null,
      referenceImages: input.referenceImages ?? null,
      designFiles: input.designFiles ?? null,
      jobId: input.jobId ?? null,
      platform: input.platform ?? null,
      purpose: input.purpose ?? null,
      service: input.service ?? null,
      size: input.size ?? null,
      timestamp: new Date(input.timestamp) ?? null,
    })
    .returning();

  if (created.length > 0) {
    revalidatePath("/");
    return redirect(`/`);
  }

  console.log("created", created);
};

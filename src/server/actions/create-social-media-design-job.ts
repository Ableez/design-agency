"use server";

import { db } from "../db";
import { designJob } from "../db/schema";

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
  email?: string;
  phone?: string;
  brand?: string;
};

export const createSocialMediaDesignJob = async (
  input: SocialMediaDesignJobInput,
) => {
  await db.insert(designJob).values({
    email: input.email ?? null,
    phone: input.phone ?? null,
    brand: input.brand ?? null,
    username: input.username ?? null,
    deliverySpeed: input.deliverySpeed ?? null,
    designDescription: input.designDescription ?? null,
    referenceImages: input.referenceImages ?? null,
    designFiles: input.designFiles ?? null,
    jobId: input.jobId ?? null,
    platform: input.platform ?? null,
    purpose: input.purpose ?? null,
    service: input.service ?? null,
    size: input.size ?? null,
    timestamp: input.timestamp ?? null,
  });
};

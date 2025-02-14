// src/server/api/routers/design-jobs.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import {
  designJob,
  designSize,
  designDeliveryOption,
  user,
} from "../../db/schema";
import { redirect } from "next/navigation";
import { mailer } from "#/lib/mailer";

// Input validation schemas
const createDesignJobSchema = z.object({
  jobId: z.string(),
  platform: z.string(),
  service: z.string(),
  designDescription: z.string(),
  referenceImages: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      size: z.string(),
      url: z.string(),
    }),
  ),
  sizeId: z.string().nullable(),
  purpose: z.string().nullish(),
  designDeliveryOptionId: z.string().nullish(),
  brandId: z.string(),
  userId: z.string().nullable(),
  deliveryDurationInHours: z.number(),
  deliveryEmail: z.string().email(),
  deliveryDate: z.string(),
});

const updateDesignJobSchema = z.object({
  id: z.string().uuid(),
  designDescription: z.string().optional(),
  referenceImages: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        size: z.number(),
        url: z.string(),
      }),
    )
    .optional(),
  sizeId: z.string().uuid().optional(),
  purpose: z.string().optional(),
  designDeliveryOptionId: z.string().uuid().optional(),
});

export const designJobsRouter = createTRPCRouter({
  // Create a new design job
  create: publicProcedure
    .input(createDesignJobSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userData = await ctx.db.query.user.findFirst({
          where: eq(user.email, input.deliveryEmail),
        });

        console.log("SE3RVER", userData);

        const [data] = await ctx.db
          .insert(designJob)
          .values({
            jobId: input.jobId,
            platform: input.platform,
            service: input.service,
            designDescription: input.designDescription,
            referenceImages: input.referenceImages.map((img) => img.url),
            sizeId: input.sizeId,
            purpose: input.purpose,
            deliveryDurationInHours: input.deliveryDurationInHours,
            deliveryEmail:
              userData?.email ??
              input.deliveryEmail ??
              ctx.user?.emailAddresses[0]?.emailAddress,
            deliveryDate: new Date(input.deliveryDate),
            brandId: input.brandId,
            userId: input.userId ?? userData?.id,
            timestamp: new Date(),
          })
          .returning();

        await mailer.sendMail({
          from: process.env.EMAIL_FROM || "noreply@asteriskda.com",
          to: "djayableez@gmail.com",
          subject: "We have received your order",
        });

        return data ?? null;
      } catch (error) {
        console.error("Error creating design job:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create design job",
        });
      } finally {
        // send email to me regard less
      }
    }),

  // Get a design job by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const job = await ctx.db.query.designJob.findFirst({
          where: eq(designJob.id, input.id),
          with: {
            brand: true,
            user: true,
            size: true,
          },
        });

        if (!job) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Design job not found",
          });
        }

        return job;
      } catch (error) {
        console.error("Error fetching design job:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch design job",
        });
      }
    }),

  // Get all design jobs for a user
  getUserJobs: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      try {
        const jobs = await ctx.db.query.designJob.findMany({
          where: eq(designJob.userId, input.userId),
          limit: limit + 1,
          //   cursor: input.cursor ? { id: input.cursor } : undefined,
          orderBy: (designJob, { desc }) => [desc(designJob.timestamp)],
          with: {
            brand: true,
            size: true,
          },
        });

        let nextCursor: typeof input.cursor | undefined = undefined;
        if (jobs.length > limit) {
          const nextItem = jobs.pop();
          nextCursor = nextItem?.id;
        }

        return {
          items: jobs,
          nextCursor,
        };
      } catch (error) {
        console.error("Error fetching user design jobs:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user design jobs",
        });
      }
    }),

  // Update a design job
  update: protectedProcedure
    .input(updateDesignJobSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || !ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const [updated] = await ctx.db
          .update(designJob)
          .set({
            ...(input.designDescription && {
              designDescription: input.designDescription,
            }),
            ...(input.referenceImages && {
              referenceImages: input.referenceImages.map((img) => img.url),
            }),
            ...(input.sizeId && { sizeId: input.sizeId }),
            ...(input.purpose && { purpose: input.purpose }),
            ...(input.designDeliveryOptionId && {
              designDeliveryOptionId: input.designDeliveryOptionId,
            }),
          })
          .where(
            and(eq(designJob.id, input.id), eq(designJob.userId, ctx.user.id)),
          )
          .returning();

        if (!updated) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Design job not found or unauthorized",
          });
        }

        return updated;
      } catch (error) {
        console.error("Error updating design job:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update design job",
        });
      }
    }),

  // Delete a design job
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || !ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const [deleted] = await ctx.db
          .delete(designJob)
          .where(
            and(eq(designJob.id, input.id), eq(designJob.userId, ctx.user.id)),
          )
          .returning();

        if (!deleted) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Design job not found or unauthorized",
          });
        }

        return deleted;
      } catch (error) {
        console.error("Error deleting design job:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete design job",
        });
      }
    }),

  // Get available design sizes
  getDesignSizes: publicProcedure.query(async ({ ctx }) => {
    try {
      const sizes = await ctx.db.query.designSize.findMany();
      return sizes;
    } catch (error) {
      console.error("Error fetching design sizes:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch design sizes",
      });
    }
  }),

  // Get available delivery options
  getDeliveryOptions: publicProcedure.query(async ({ ctx }) => {
    try {
      const options = await ctx.db.query.designDeliveryOption.findMany();
      return options;
    } catch (error) {
      console.error("Error fetching delivery options:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch delivery options",
      });
    }
  }),
});

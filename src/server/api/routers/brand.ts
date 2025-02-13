import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { brands } from "#/server/db/schema";
import { TRPCError } from "@trpc/server";

export const brandRouter = createTRPCRouter({
  getUserBrandByUserId: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      if (!input.userId || !ctx.user || !ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const [data] = await ctx.db
        .select()
        .from(brands)
        .where(eq(brands.owner, ctx.user.id));

      return data ?? null;
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string(), industry: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || !ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const [data] = await ctx.db
          .insert(brands)
          .values({
            name: input.name,
            owner: ctx.user.id,
            industry: input.industry,
          })
          .returning();

        return data ?? null;
      } catch (error) {
        console.error("Error creating brand:", error);
        return null;
      }
    }),
});

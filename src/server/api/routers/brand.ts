import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { and, eq } from "drizzle-orm";
import { brands, user } from "#/server/db/schema";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "#/server/clerk/backend";
import { date } from "drizzle-orm/mysql-core";
import { BrandSelect } from "#/server/db/schema-types";

export const brandRouter = createTRPCRouter({
  getUserBrandByUserId: protectedProcedure.query(async ({ input, ctx }) => {
    if (!ctx.user || !ctx.user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const data = await ctx.db.query.brands.findMany({
      where: eq(brands.owner, ctx.user.id),
    });
    return data ?? null;
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        industry: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        let userId = ctx.user?.id;
        let brand: BrandSelect | null = null;

        if (!userId) {
          const userData = await ctx.db.query.user.findFirst({
            where: eq(user.email, input.email),
            with: {
              brands: true,
            },
          });

          userId = userData?.id;

          if (!userData) {
            const createdUser = await clerkClient.users.createUser({
              emailAddress: [input.email],
              password: Math.random().toString(36).slice(2, 10),
              username: input.email.split("@")[0],
            });

            if (!createdUser) {
              return { error: "You need to have an account" };
            }

            await ctx.db.insert(user).values({
              id: createdUser.id,
              email: createdUser.emailAddresses[0]?.emailAddress ?? "",
              username: createdUser.username ?? "",
              profileImageUrl: createdUser.imageUrl ?? "",
              createdAt: new Date(createdUser.createdAt),
              updatedAt: new Date(createdUser.updatedAt),
            });

            userId = createdUser.id;
          }

          brand =
            userData?.brands?.find(
              (brand) =>
                brand.name.toLowerCase().trim() ===
                input.name.toLowerCase().trim(),
            ) ?? null;
        }

        if (!userId) {
          return { error: "You need to have an account" };
        }

        if (
          brand?.name?.toLowerCase().trim() === input.name.toLowerCase().trim()
        ) {
          console.log("BRAND ALREADY EXISTS");
          return { ...brand, error: "Brand already exists" };
        }

        const [data] = await ctx.db
          .insert(brands)
          .values({
            name: input.name,
            owner: userId,
            industry: input.industry,
          })
          .returning();

        return { ...data, error: null };
      } catch (error) {
        console.error("Error creating brand:", error);
        console.log(JSON.stringify(error, null, 2));
        return null;
      }
    }),
});

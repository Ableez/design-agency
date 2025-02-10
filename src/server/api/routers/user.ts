import { user } from "#/server/db/schema";
import { eq } from "drizzle-orm";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: privateProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new Error("userid not found");
    }

    const userData = await ctx.db
      .select()
      .from(user)
      .where(eq(user.id, ctx.userId));

    if (!userData) {
      throw new Error("User not found");
    }

    return userData;
  }),
});

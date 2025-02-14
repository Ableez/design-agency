import { mailer } from "#/lib/mailer";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const emailRouter = createTRPCRouter({
  send: publicProcedure.mutation(async ({ ctx, input }) => {
    try {
      await mailer.sendMail({
        from: process.env.EMAIL_FROM || "noreply@asteriskda.com",
        to: "djayableez@gmail.com",
        subject: "We have received your order",
      });

      return { success: true };
    } catch (error) {
      console.error("ERROR SENDING MAIL:::::s", error);
    }
  }),
});

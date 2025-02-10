import { db } from "#/server/db";
import { designJob } from "#/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const jobsRouter = createTRPCRouter({});

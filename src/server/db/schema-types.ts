import { InferSelectModel } from "drizzle-orm";
import { brands } from "./schema";

export type BrandSelect = InferSelectModel<typeof brands>;

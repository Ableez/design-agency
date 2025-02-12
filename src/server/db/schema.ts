// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  varchar,
  timestamp,
  uuid,
  text,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `aste-off_${name}`);

export const user = createTable("auth_user", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: varchar("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  designJobs: many(designJob),
  brands: many(brands),
}));

export const brands = createTable("brand", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }),
  owner: varchar("owner", { length: 256 }).references(() => user.id),
  logo: varchar("logo", { length: 256 }),
  phoneNumber: integer("phone_number"),
  email: varchar("email", { length: 256 }),
  website: varchar("website", { length: 256 }),
});

export const brandRelations = relations(brands, ({ many, one }) => ({
  designJobs: many(designJob),
  owner: one(user),
}));

export const jobs = createTable("job", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  jobId: varchar("job_id", { length: 256 }).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  service: varchar("service", { length: 256 }).notNull(),
  designDescription: varchar("design_description", { length: 256 }),
  referenceImages: varchar("reference_images", { length: 256 }),
  designFiles: varchar("design_files", { length: 256 }),
  userId: varchar("user_id", { length: 256 }).references(() => user.id),
  status: varchar("status", { length: 256 })
    .$type<"not_started" | "pending" | "ongoing" | "completed" | "delivered">()
    .default("not_started")
    .notNull(),
});

export const designJob = createTable("design_job", {
  id: uuid("id").primaryKey().defaultRandom(),
  size: varchar("size", { length: 256 }),
  purpose: varchar("purpose", { length: 256 }),
  platform: varchar("platform", { length: 256 }),
  deliverySpeed: varchar("delivery_speed", { length: 256 }),
  jobId: varchar("job_id", { length: 256 }),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  service: varchar("service", { length: 256 }),
  designDescription: varchar("design_description", { length: 256 }),
  referenceImages: text("reference_images"),
  designFiles: varchar("design_files", { length: 256 }),
  username: varchar("username", { length: 256 }),
  email: varchar("email", { length: 256 }),
  phone: varchar("phone", { length: 256 }),
  brand: varchar("brand", { length: 256 }),
  userId: varchar("user_id").references(() => user.id),
});

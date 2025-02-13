ALTER TABLE "asterisk_brand" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "asterisk_brand" ALTER COLUMN "industry" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "asterisk_design_size" ADD COLUMN "slug" varchar NOT NULL;
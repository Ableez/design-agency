CREATE TABLE IF NOT EXISTS "aste-off_design_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"size" varchar(256),
	"purpose" varchar(256),
	"platform" varchar(256),
	"delivery_speed" varchar(256),
	"job_id" varchar(256),
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"service" varchar(256),
	"design_description" varchar(256),
	"reference_images" varchar(256),
	"design_files" varchar(256),
	"username" varchar(256),
	"email" varchar(256),
	"phone" varchar(256),
	"brand" varchar(256),
	"user_id" varchar
);
--> statement-breakpoint
ALTER TABLE "aste-off_brand" ADD COLUMN "owner" varchar(256);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aste-off_design_job" ADD CONSTRAINT "aste-off_design_job_user_id_aste-off_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."aste-off_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aste-off_brand" ADD CONSTRAINT "aste-off_brand_owner_aste-off_auth_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."aste-off_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

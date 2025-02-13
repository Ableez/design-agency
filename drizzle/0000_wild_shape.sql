CREATE TABLE IF NOT EXISTS "asterisk_brand" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"owner" varchar(256),
	"logo" varchar(256),
	"phone_number" integer,
	"email" varchar(256),
	"website" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "asterisk_design_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"size" varchar(256),
	"purpose" varchar(256),
	"platform" varchar(256),
	"delivery_speed" varchar(256),
	"job_id" varchar(256),
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"service" varchar(256),
	"design_description" varchar(256),
	"reference_images" text,
	"design_files" varchar(256),
	"username" varchar(256),
	"email" varchar(256),
	"phone" varchar(256),
	"brand" uuid,
	"user_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "asterisk_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar(256) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"service" varchar(256) NOT NULL,
	"design_description" varchar(256),
	"reference_images" varchar(256),
	"design_files" varchar(256),
	"user_id" varchar(256),
	"status" varchar(256) DEFAULT 'not_started' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "asterisk_auth_user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" varchar,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "asterisk_auth_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "asterisk_brand" ADD CONSTRAINT "asterisk_brand_owner_asterisk_auth_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."asterisk_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "asterisk_design_job" ADD CONSTRAINT "asterisk_design_job_brand_asterisk_brand_id_fk" FOREIGN KEY ("brand") REFERENCES "public"."asterisk_brand"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "asterisk_design_job" ADD CONSTRAINT "asterisk_design_job_user_id_asterisk_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."asterisk_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "asterisk_job" ADD CONSTRAINT "asterisk_job_user_id_asterisk_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."asterisk_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

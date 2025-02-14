CREATE TABLE "asterisk_brand" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"owner" varchar(256),
	"description" text,
	"industry" text NOT NULL,
	"logo" varchar(256),
	"phone_number" integer,
	"email" varchar(256),
	"website" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "asterisk_design_delivery_option" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"duration" varchar(256),
	"icon" text
);
--> statement-breakpoint
CREATE TABLE "asterisk_design_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" varchar(256),
	"size_id" uuid,
	"purpose" varchar(256),
	"service" varchar(256),
	"delivery_duration_in_hours" integer NOT NULL,
	"delivery_date" timestamp with time zone NOT NULL,
	"delivery_email" varchar(256) NOT NULL,
	"job_id" varchar(256) NOT NULL,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"design_description" text,
	"reference_images" varchar[],
	"design_files" varchar[],
	"username" varchar(256),
	"email" varchar(256),
	"phone" varchar(256),
	"brand_id" uuid,
	"user_id" varchar
);
--> statement-breakpoint
CREATE TABLE "asterisk_design_size" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"title" varchar(256) NOT NULL,
	"aspect_ratio" varchar(256) NOT NULL,
	"dimensions" varchar(256) NOT NULL,
	"unit" varchar(256) NOT NULL,
	"image" varchar(512)
);
--> statement-breakpoint
CREATE TABLE "asterisk_job" (
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
CREATE TABLE "asterisk_user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"profile_image_url" varchar,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "asterisk_user_username_unique" UNIQUE("username"),
	CONSTRAINT "asterisk_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "asterisk_brand" ADD CONSTRAINT "asterisk_brand_owner_asterisk_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."asterisk_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asterisk_design_job" ADD CONSTRAINT "asterisk_design_job_size_id_asterisk_design_size_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."asterisk_design_size"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asterisk_design_job" ADD CONSTRAINT "asterisk_design_job_brand_id_asterisk_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."asterisk_brand"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asterisk_design_job" ADD CONSTRAINT "asterisk_design_job_user_id_asterisk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."asterisk_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asterisk_job" ADD CONSTRAINT "asterisk_job_user_id_asterisk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."asterisk_user"("id") ON DELETE no action ON UPDATE no action;
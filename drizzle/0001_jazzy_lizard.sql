ALTER TABLE "asterisk_auth_user" RENAME TO "asterisk_user";--> statement-breakpoint
ALTER TABLE "asterisk_user" RENAME COLUMN "name" TO "username";--> statement-breakpoint
ALTER TABLE "asterisk_user" DROP CONSTRAINT "asterisk_auth_user_email_unique";--> statement-breakpoint
ALTER TABLE "asterisk_brand" DROP CONSTRAINT "asterisk_brand_owner_asterisk_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "asterisk_design_job" DROP CONSTRAINT "asterisk_design_job_user_id_asterisk_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "asterisk_job" DROP CONSTRAINT "asterisk_job_user_id_asterisk_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "asterisk_user" ADD COLUMN "profile_image_url" varchar;--> statement-breakpoint
ALTER TABLE "asterisk_brand" ADD CONSTRAINT "asterisk_brand_owner_asterisk_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."asterisk_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asterisk_design_job" ADD CONSTRAINT "asterisk_design_job_user_id_asterisk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."asterisk_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asterisk_job" ADD CONSTRAINT "asterisk_job_user_id_asterisk_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."asterisk_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asterisk_user" DROP COLUMN "email_verified";--> statement-breakpoint
ALTER TABLE "asterisk_user" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "asterisk_user" ADD CONSTRAINT "asterisk_user_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "asterisk_user" ADD CONSTRAINT "asterisk_user_email_unique" UNIQUE("email");
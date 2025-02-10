ALTER TABLE "aste-off_job" RENAME COLUMN "user_info" TO "user_id";--> statement-breakpoint
ALTER TABLE "aste-off_job" DROP CONSTRAINT "aste-off_job_user_info_aste-off_auth_user_id_fk";
--> statement-breakpoint
ALTER TABLE "aste-off_job" ALTER COLUMN "job_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "aste-off_job" ALTER COLUMN "service" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "aste-off_job" ADD COLUMN "status" varchar(256) DEFAULT 'not_started' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aste-off_job" ADD CONSTRAINT "aste-off_job_user_id_aste-off_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."aste-off_auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

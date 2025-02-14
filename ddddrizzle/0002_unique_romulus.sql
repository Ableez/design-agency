ALTER TABLE "asterisk_design_job" DROP CONSTRAINT "asterisk_design_job_design_delivery_option_asterisk_design_delivery_option_id_fk";
--> statement-breakpoint
ALTER TABLE "asterisk_design_job" ADD COLUMN "delivery_duration_in_hours" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "asterisk_design_job" ADD COLUMN "delivery_date" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "asterisk_design_job" ADD COLUMN "delivery_email" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "asterisk_design_job" DROP COLUMN "design_delivery_option";
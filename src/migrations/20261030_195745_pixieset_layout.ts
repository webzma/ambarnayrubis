import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "galleries_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "albums" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "albums_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "inquiries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "albums" CASCADE;
  DROP TABLE "albums_rels" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_albums_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_inquiries_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_about_image_id_media_id_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_albums_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_inquiries_id_idx";
  DROP INDEX IF EXISTS "site_settings_about_image_idx";
  ALTER TABLE "site_settings" ALTER COLUMN "site_name" SET DEFAULT 'Ambarnayrubis';
  ALTER TABLE "galleries" ADD COLUMN "listed" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "intro" varchar;
  ALTER TABLE "galleries_texts" ADD CONSTRAINT "galleries_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "galleries_texts_order_parent" ON "galleries_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "albums_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "inquiries_id";
  ALTER TABLE "site_settings" DROP COLUMN "about_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_text";
  ALTER TABLE "site_settings" DROP COLUMN "about_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "phone";
  ALTER TABLE "site_settings" DROP COLUMN "whatsapp";
  ALTER TABLE "site_settings" DROP COLUMN "location";
  DROP TYPE "public"."enum_albums_category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_albums_category" AS ENUM('bodas', 'retratos', 'familias', 'eventos', 'maternidad', 'comercial');
  CREATE TABLE "albums" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"category" "enum_albums_category",
  	"description" varchar,
  	"cover_id" integer NOT NULL,
  	"published" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "albums_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"event_type" varchar,
  	"event_date" timestamp(3) with time zone,
  	"message" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "galleries_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "galleries_texts" CASCADE;
  ALTER TABLE "site_settings" ALTER COLUMN "site_name" SET DEFAULT 'Ambar Nayrubis';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "albums_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "inquiries_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "about_title" varchar DEFAULT 'Hola, soy Ambar';
  ALTER TABLE "site_settings" ADD COLUMN "about_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "about_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "phone" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "whatsapp" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "location" varchar;
  ALTER TABLE "albums" ADD CONSTRAINT "albums_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "albums_slug_idx" ON "albums" USING btree ("slug");
  CREATE INDEX "albums_cover_idx" ON "albums" USING btree ("cover_id");
  CREATE INDEX "albums_updated_at_idx" ON "albums" USING btree ("updated_at");
  CREATE INDEX "albums_created_at_idx" ON "albums" USING btree ("created_at");
  CREATE INDEX "albums_rels_order_idx" ON "albums_rels" USING btree ("order");
  CREATE INDEX "albums_rels_parent_idx" ON "albums_rels" USING btree ("parent_id");
  CREATE INDEX "albums_rels_path_idx" ON "albums_rels" USING btree ("path");
  CREATE INDEX "albums_rels_media_id_idx" ON "albums_rels" USING btree ("media_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_media_id_idx" ON "site_settings_rels" USING btree ("media_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_albums_fk" FOREIGN KEY ("albums_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_albums_id_idx" ON "payload_locked_documents_rels" USING btree ("albums_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "site_settings_about_image_idx" ON "site_settings" USING btree ("about_image_id");
  ALTER TABLE "galleries" DROP COLUMN "listed";
  ALTER TABLE "site_settings" DROP COLUMN "intro";`)
}

    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL UNIQUE,
	"username" VARCHAR(50) NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"role" VARCHAR(20) DEFAULT 'user',
	PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "Trucks" (
	"id" serial NOT NULL UNIQUE,
	"name" varchar(80) NOT NULL UNIQUE,
	"cuisine" varchar(80) NOT NULL,
	"location" numeric(9, 6) NOT NULL,
	"vendor_id" bigint NOT NULL,
	PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "favorites" (
	"id" serial NOT NULL UNIQUE,
	"user_id" bigint NOT NULL,
	"truck_id" bigint NOT NULL,
	PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "user_preferences" (
	"user_id" serial NOT NULL UNIQUE,
	"cuisine_preferences" varchar(255) NOT NULL,
	"dietary_restrictions" serial NOT NULL,
	"location_preference" serial NOT NULL,
	"search_area" INTEGER NOT NULL DEFAULT '5000',
	PRIMARY KEY ("user_id")
);
CREATE TABLE IF NOT EXISTS "truck_menu" (
	"id" serial NOT NULL UNIQUE,
	"truck_id" bigint NOT NULL,
	"item_name" varchar(255) NOT NULL,
	"description" varchar(800) NOT NULL,
	"price" numeric(10 , 2) NOT NULL,
	"dietary_restrictions" varchar(255) NOT NULL,
	"is_available" boolean NOT NULL DEFAULT true,
	PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial NOT NULL UNIQUE,
	"truck_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"rating" bigint NOT NULL,
	"comment" varchar(500) NOT NULL,
	"photos" varchar(255) NOT NULL,
	"time_stamp" timestamp with time zone NOT NULL,
	PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "menu" (
	"id" serial NOT NULL UNIQUE,
	"new_field" bigint NOT NULL,
	PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "DietaryRestrictions" (
	"id" serial NOT NULL UNIQUE,
	"Vegetarian" varchar(255) NOT NULL,
	"Vegan" varchar(255) NOT NULL,
	"Gluten_Free" varchar(255) NOT NULL,
	"Paleo" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);
ALTER TABLE "users" ADD CONSTRAINT "users_fk3" FOREIGN KEY ("user_role") REFERENCES "Trucks"("id");
ALTER TABLE "Trucks" ADD CONSTRAINT "Trucks_fk1" FOREIGN KEY ("name") REFERENCES "favorites"("id");
ALTER TABLE "Trucks" ADD CONSTRAINT "Trucks_fk4" FOREIGN KEY ("vendor_id") REFERENCES "users"("id");
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "truck_menu" ADD CONSTRAINT "truck_menu_fk1" FOREIGN KEY ("truck_id") REFERENCES "Trucks"("id");
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk1" FOREIGN KEY ("truck_id") REFERENCES "users"("id");
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk2" FOREIGN KEY ("user_id") REFERENCES "food_trucks"("id");
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk3" FOREIGN KEY ("rating") REFERENCES "Trucks"("id");
INSERT INTO "Trucks" ("name", "cuisine", "location", "vendor_id")
VALUES
    ('Best Steak & Gyros House', 'Mediterranean', 44.977753, 1000001),
    ('Tender Lovin’ Chix', 'American', 44.977753, 1000002),
    ('Kabomelette', 'Brunch Vegetarian American', 44.948798, 1000003),
    ('The Brick Oven Bus', 'Pizza', 44.840800, 1000004),
    ('Momma Rose', 'Soul Food', 44.953703, 1000005),
    ('Animales Barbeque Co.', 'Barbeque Burgers', 44.998734, 1000006),
    ('Wallace Cuisine', 'American', 44.958680, 1000007),
    ('Gray Duck Concessions', 'Desserts Coffee', 45.011872, 1000008),
    ('The Rolling Green', 'Vegan', 45.012345, 1000009),
    ('Urban Grill', 'Fusion', 45.019876, 1000010);
    INSERT INTO "Trucks" ("name", "cuisine", "location", "vendor_id")
VALUES
    ('Lobster & Co.', 'Seafood', 44.972392, 1000011),
    ('El Burrito Express', 'Mexican', 44.937483, 1000012),
    ('Pho Nom Nom', 'Vietnamese', 44.979560, 1000013),
    ('Burgers & Buns', 'American', 44.951905, 1000014),
    ('Taste of Seoul', 'Korean', 44.965317, 1000015),
    ('Chili Hut', 'Tex-Mex', 44.945673, 1000016),
    ('Island Flavors', 'Caribbean', 44.972141, 1000017),
    ('Green Machine', 'Vegetarian', 44.983113, 1000018),
    ('Sushi Station', 'Japanese', 44.946573, 1000019),
    ('The Crepe Cart', 'French', 44.947627, 1000020)
    ;
    ALTER TABLE users
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'
;
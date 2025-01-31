    -- Drop existing tables if they exist
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "favorites" CASCADE;
DROP TABLE IF EXISTS "truck_menu" CASCADE;
DROP TABLE IF EXISTS "reviews" CASCADE;
DROP TABLE IF EXISTS "Trucks" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Create session table for authentication
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- Users table
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" VARCHAR(20) DEFAULT 'user'
);

-- Trucks table
CREATE TABLE "Trucks" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(80) NOT NULL,
    "cuisine_type" VARCHAR(80) NOT NULL,
    "description" TEXT,
    "vendor_id" INTEGER REFERENCES "users"("id"),
    "latitude" NUMERIC(10,6),
    "longitude" NUMERIC(10,6),
    "last_location_update" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE "reviews" (
    "id" SERIAL PRIMARY KEY,
    "truck_id" INTEGER REFERENCES "Trucks"("id") ON DELETE CASCADE,
    "user_id" INTEGER REFERENCES "users"("id"),
    "rating" INTEGER CHECK (rating >= 1 AND rating <= 5),
    "comment" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Truck menu table
CREATE TABLE "truck_menu" (
    "id" SERIAL PRIMARY KEY,
    "truck_id" INTEGER REFERENCES "Trucks"("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "category" VARCHAR(50)
);

-- Favorites table
CREATE TABLE "favorites" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "users"("id"),
    "truck_id" INTEGER REFERENCES "Trucks"("id"),
    UNIQUE("user_id", "truck_id")
);

-- Insert sample user data
INSERT INTO "users" ("username", "password", "role") VALUES
    ('vendor1', '$2a$10$encrypted_password', 'vendor'),
    ('vendor2', '$2a$10$encrypted_password', 'vendor'),
    ('user1', '$2a$10$encrypted_password', 'user'),
    ('animales_vendor', '$2a$10$encrypted_password', 'vendor'),
    ('wallace_vendor', '$2a$10$encrypted_password', 'vendor'),
    ('grayduck_vendor', '$2a$10$encrypted_password', 'vendor'),
    ('taco_vendor', '$2a$10$encrypted_password', 'vendor'),
    ('fusion_vendor', '$2a$10$encrypted_password', 'vendor'),
    ('doughboy_vendor', '$2a$10$encrypted_password', 'vendor'),
    ('sweetspot_vendor', '$2a$10$encrypted_password', 'vendor'),
    ('phoking_vendor', '$2a$10$encrypted_password', 'vendor'),
    ('sushi_vendor', '$2a$10$encrypted_password', 'vendor'),
    ('testuser', '$2a$10$yvBn1XZrDEkxMjZkYA.kKu8yD5QUV9yGRZKi7K/qB2qwBDJvWn28.', 'user');

-- Insert sample truck data
INSERT INTO "Trucks" ("name", "cuisine_type", "description", "vendor_id", "latitude", "longitude") VALUES
    ('Best Steak & Gyros', 'Mediterranean', 'Authentic Mediterranean cuisine', 1, 44.977753, -93.265011),
    ('Tender Lovin Chix', 'American', 'Gourmet chicken dishes', 1, 44.977753, -93.266011),
    ('Kabomelette', 'Brunch', 'Breakfast all day', 2, 44.948798, -93.267011),
    ('The Brick Oven Bus', 'Pizza', 'Wood-fired pizzas', 2, 44.840800, -93.268011),
    ('Momma Rose', 'Soul Food', 'Southern comfort food', 1, 44.953703, -93.269011),
    ('Animales Barbeque Co.', 'Barbeque', 'Specialty barbeque and burgers located at Bauhaus Brew Labs', 4, 45.001857, -93.267263),
    ('Wallace Cuisine', 'American', 'Local Minneapolis cuisine', 5, 44.947731, -93.298362),
    ('Gray Duck Concessions', 'Desserts', 'Specializing in desserts and coffee', 6, 45.027681, -93.005722),
    ('Taco Heaven', 'Mexican', 'Authentic Mexican street tacos and burritos', 7, 44.974722, -93.267763),
    ('Fresh Fusion', 'Asian Fusion', 'A blend of Asian street food flavors', 8, 44.970926, -93.268823),
    ('Doughboy Pizza', 'Pizza', 'Wood-fired artisan pizzas with fresh ingredients', 9, 44.983556, -93.259247),
    ('The Sweet Spot', 'Desserts', 'Sweet treats including ice cream and churros', 10, 44.951563, -93.273999),
    ('Pho King', 'Vietnamese', 'Traditional pho and Vietnamese snacks', 11, 44.974100, -93.272500),
    ('Sushi Rolls', 'Japanese', 'Fresh sushi rolls and sashimi', 12, 44.947203, -93.259104);

-- Insert sample menu items
INSERT INTO "truck_menu" ("truck_id", "name", "description", "price", "category") VALUES
    (1, 'Gyro Plate', 'Traditional gyro with rice and salad', 12.99, 'Entree'),
    (1, 'Falafel Wrap', 'Homemade falafel with tahini', 9.99, 'Sandwich'),
    (2, 'Chicken Sandwich', 'Crispy chicken with special sauce', 11.99, 'Sandwich'),
    (3, 'Breakfast Burrito', 'Eggs, cheese, and potatoes', 8.99, 'Breakfast'),
    (6, 'Smoked Brisket Plate', 'Texas-style smoked brisket with sides', 18.99, 'Entree'),
    (6, 'Specialty Burger', 'House blend patty with special sauce', 14.99, 'Entree'),
    (7, 'Minneapolis Hot Dish', 'Traditional Minnesota comfort food', 12.99, 'Entree'),
    (7, 'Local Fish Fry', 'Fresh local fish with fries', 16.99, 'Entree'),
    (8, 'Specialty Coffee', 'House blend coffee', 4.99, 'Beverage'),
    (8, 'Artisan Pastry', 'Daily fresh-baked pastry', 5.99, 'Dessert'),
    (9, 'Taco Al Pastor', 'Marinated pork with pineapple and cilantro', 5.99, 'Taco'),
    (9, 'Beef Burrito', 'Seasoned beef, beans, and rice wrapped in a soft tortilla', 9.99, 'Burrito'),
    (10, 'Korean BBQ Tacos', 'Marinated beef, kimchi, and spicy mayo', 7.99, 'Taco'),
    (10, 'Pho Noodle Bowl', 'Rice noodles in a rich, flavorful broth', 10.99, 'Soup'),
    (11, 'Margherita Pizza', 'Fresh tomatoes, mozzarella, and basil', 13.99, 'Pizza'),
    (11, 'Pepperoni Pizza', 'Classic pepperoni pizza with mozzarella', 14.99, 'Pizza'),
    (12, 'Churros', 'Crispy fried churros with cinnamon sugar', 4.99, 'Dessert'),
    (12, 'Ice Cream Sandwich', 'Homemade ice cream between two cookies', 6.99, 'Dessert'),
    (13, 'Pho Bo', 'Beef pho with rice noodles and herbs', 11.99, 'Soup'),
    (13, 'Vietnamese Spring Rolls', 'Fresh spring rolls with shrimp and veggies', 7.99, 'Appetizer'),
    (14, 'California Roll', 'Crab, avocado, cucumber, and rice', 8.99, 'Sushi'),
    (14, 'Spicy Tuna Roll', 'Tuna with spicy mayo and cucumber', 9.99, 'Sushi');

-- Insert sample reviews
INSERT INTO "reviews" ("truck_id", "user_id", "rating", "comment") VALUES
    (1, 3, 5, 'Best gyros in town!'),
    (2, 3, 4, 'Great chicken sandwich'),
    (3, 3, 5, 'Amazing breakfast options'),
    (6, 3, 5, 'Best BBQ in Minneapolis!'),
    (7, 3, 4, 'Great local flavors'),
    (8, 3, 5, 'Amazing coffee and pastries!'),
    (9, 3, 5, 'Best tacos I have had outside of Mexico!'),
    (9, 1, 4, 'Great flavors, but could use more spice!'),
    (10, 3, 5, 'Loved the Korean BBQ tacos! So flavorful.'),
    (10, 2, 4, 'Pho was good, but the tacos were even better!'),
    (11, 3, 4, 'Great pizza, crispy crust, but a bit too salty.'),
    (11, 1, 5, 'Best pizza I have had on the go!'),
    (12, 3, 5, 'The churros are out of this world!'),
    (12, 2, 5, 'Ice cream sandwiches are a must-try!'),
    (13, 3, 5, 'Amazing pho, authentic and delicious.'),
    (13, 1, 4, 'Spring rolls were delicious, pho could use more flavor.'),
    (14, 3, 5, 'Fresh and tasty, love the spicy tuna roll!'),
    (14, 2, 4, 'Good sushi, but the rolls are a bit small.');
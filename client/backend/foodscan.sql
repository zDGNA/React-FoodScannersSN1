-- client/backend/foodscan.sql

-- Database creation
CREATE DATABASE IF NOT EXISTS foodscan_db;
USE foodscan_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User settings/goals table
CREATE TABLE user_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    daily_calorie_goal INT DEFAULT 2000,
    target_weight DECIMAL(5,2),
    current_weight DECIMAL(5,2),
    height DECIMAL(5,2),
    unit_system ENUM('metric', 'imperial') DEFAULT 'metric',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Food database table
CREATE TABLE foods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    serving_size DECIMAL(10,2) DEFAULT 100,
    serving_unit VARCHAR(20) DEFAULT 'g',
    calories DECIMAL(10,2) NOT NULL,
    protein DECIMAL(10,2),
    carbs DECIMAL(10,2),
    fat DECIMAL(10,2),
    fiber DECIMAL(10,2),
    sugar DECIMAL(10,2),
    sodium DECIMAL(10,2),
    vitamin_a INT,
    vitamin_c INT,
    calcium INT,
    iron INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scan history table
CREATE TABLE scan_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    food_id INT,
    food_name VARCHAR(255) NOT NULL,
    meal_type ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack') NOT NULL,
    portion DECIMAL(10,2) NOT NULL,
    portion_unit VARCHAR(20) DEFAULT 'g',
    calories DECIMAL(10,2) NOT NULL,
    protein DECIMAL(10,2),
    carbs DECIMAL(10,2),
    fat DECIMAL(10,2),
    fiber DECIMAL(10,2),
    image_url VARCHAR(255),
    scan_date DATE NOT NULL,
    scan_time TIME NOT NULL,
    ai_confidence DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL
);

-- Daily nutrition summary table (for performance)
CREATE TABLE daily_summary (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    total_calories DECIMAL(10,2) DEFAULT 0,
    total_protein DECIMAL(10,2) DEFAULT 0,
    total_carbs DECIMAL(10,2) DEFAULT 0,
    total_fat DECIMAL(10,2) DEFAULT 0,
    total_fiber DECIMAL(10,2) DEFAULT 0,
    meal_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date)
);

-- User preferences table
CREATE TABLE user_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    meal_reminders BOOLEAN DEFAULT TRUE,
    reminder_breakfast TIME DEFAULT '08:00:00',
    reminder_lunch TIME DEFAULT '12:00:00',
    reminder_dinner TIME DEFAULT '18:00:00',
    dark_mode BOOLEAN DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'en',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample food data
INSERT INTO foods (name, category, serving_size, serving_unit, calories, protein, carbs, fat, fiber, sugar, vitamin_a, vitamin_c, calcium, iron) VALUES
('Grilled Chicken Breast', 'Protein', 100, 'g', 165, 31, 0, 3.6, 0, 0, 5, 0, 15, 1),
('White Rice', 'Grains', 100, 'g', 130, 2.7, 28, 0.3, 0.4, 0.1, 0, 0, 10, 2),
('Broccoli', 'Vegetables', 100, 'g', 34, 2.8, 7, 0.4, 2.6, 1.7, 12, 135, 47, 4),
('Salmon', 'Protein', 100, 'g', 208, 20, 0, 13, 0, 0, 2, 0, 9, 3),
('Banana', 'Fruits', 100, 'g', 89, 1.1, 23, 0.3, 2.6, 12, 1, 15, 5, 2),
('Omelette', 'Protein', 100, 'g', 154, 11, 1.2, 12, 0, 0.8, 15, 0, 50, 7),
('Greek Yogurt', 'Dairy', 100, 'g', 59, 10, 3.6, 0.4, 0, 3.2, 0, 1, 110, 0),
('Sweet Potato', 'Vegetables', 100, 'g', 86, 1.6, 20, 0.1, 3, 4.2, 283, 35, 30, 4),
('Avocado', 'Fruits', 100, 'g', 160, 2, 8.5, 15, 6.7, 0.7, 3, 17, 12, 3),
('Brown Bread', 'Grains', 100, 'g', 247, 13, 41, 3.4, 6, 5, 0, 0, 80, 15);

-- Create indexes for performance
CREATE INDEX idx_scan_history_user_date ON scan_history(user_id, scan_date);
CREATE INDEX idx_daily_summary_user_date ON daily_summary(user_id, date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_foods_name ON foods(name);
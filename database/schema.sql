-- =======================================================================
-- Sales Savvy - Complete Database Schema & Initial Seed Data
-- Database Engine: MySQL 8.0+
-- Database Name: salessavvy
-- Based on Module 7 Requirements & Database Design Specifications
-- =======================================================================

CREATE DATABASE IF NOT EXISTS `salessavvy` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `salessavvy`;

-- 1. Users Table
DROP TABLE IF EXISTS `jwt_tokens`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `productimages`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. JWT Tokens Table
CREATE TABLE `jwt_tokens` (
    `token_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `token` VARCHAR(512) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `expires_at` TIMESTAMP NOT NULL,
    PRIMARY KEY (`token_id`),
    CONSTRAINT `fk_jwt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Categories Table
CREATE TABLE `categories` (
    `category_id` INT NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Products Table
CREATE TABLE `products` (
    `product_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `stock` INT NOT NULL DEFAULT 0,
    `category_id` INT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`product_id`),
    CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Product Images Table
CREATE TABLE `productimages` (
    `image_id` INT NOT NULL AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `image_url` TEXT NOT NULL,
    PRIMARY KEY (`image_id`),
    CONSTRAINT `fk_productimages_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Cart Items Table
CREATE TABLE `cart_items` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Orders Table
CREATE TABLE `orders` (
    `order_id` VARCHAR(255) NOT NULL,
    `user_id` INT NOT NULL,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'APPROVED', 'SHIPPED', 'DELIVERED') DEFAULT 'PENDING',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`order_id`),
    CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Order Items Table
CREATE TABLE `order_items` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(255) NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `price_per_unit` DECIMAL(10,2) NOT NULL,
    `total_price` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =======================================================================
-- Initial Seed Data
-- =======================================================================

-- Default Users (Passwords hashed with BCrypt, default raw password: "password123")
-- Hash for 'password123': $2a$10$7EqJtq98hPqEX7fNZaFWoOht7XfKz3sLw5i.o5Q5jRkeoYxLz9j1q
INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES
('admin', 'admin@salessavvy.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOht7XfKz3sLw5i.o5Q5jRkeoYxLz9j1q', 'ADMIN'),
('customer1', 'customer1@salessavvy.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOht7XfKz3sLw5i.o5Q5jRkeoYxLz9j1q', 'CUSTOMER'),
('div', 'div@salessavvy.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOht7XfKz3sLw5i.o5Q5jRkeoYxLz9j1q', 'CUSTOMER');

-- Categories
INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'Shirts'),
(2, 'Pants'),
(3, 'Accessories'),
(4, 'Mobiles'),
(5, 'Mobile Accessories');

-- Products
INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock`, `category_id`) VALUES
(1, 'Classic Oxford Slim Shirt', 'Premium breathable cotton woven with a refined slim fit profile.', 499.99, 100, 1),
(2, 'Urban Chambray Casual Shirt', 'Vintage washed tailored casual shirt suitable for work and leisure.', 599.99, 85, 1),
(3, 'Bespoke Linen Summer Shirt', 'Lightweight European flax linen shirt featuring shell buttons.', 699.99, 60, 1),
(4, 'Tailored Stretch Chinos', 'Four-way flexibility chinos offering tailored comfort and durability.', 899.99, 75, 2),
(5, 'Raw Indigo Selvedge Denim', 'Handcrafted Japanese selvedge denim jeans with authentic brass hardware.', 1299.99, 45, 2),
(6, 'Minimalist Chronograph Watch', 'Brushed stainless steel timepiece with sapphire crystal glass.', 2499.99, 30, 3),
(7, 'Full-Grain Italian Leather Belt', 'Vegetable-tanned leather belt with matte palladium finish buckle.', 649.99, 90, 3),
(8, 'Zenith Pro 5G Flagship Phone', 'Ultra-fast processor, 120Hz OLED edge display and Leica optics.', 42999.00, 25, 4),
(9, 'Aero Buds ANC Wireless Earphones', 'Active noise cancelling wireless earbuds with 36-hour total battery life.', 3499.00, 120, 5),
(10, 'MagShield Magnetic Kevlar Case', 'Military-grade protective shockproof phone case with magnetic ring support.', 799.00, 150, 5);

-- Product Images (Using verified KodNest CDN URLs and high-fidelity product photography)
INSERT INTO `productimages` (`product_id`, `image_url`) VALUES
(1, 'https://kodnest-docs.b-cdn.net/salessavvy/COSTOMER%20IMAGES/shirt1.png'),
(2, 'https://kodnest-docs.b-cdn.net/salessavvy/COSTOMER%20IMAGES/shirt2.png'),
(3, 'https://kodnest-docs.b-cdn.net/salessavvy/COSTOMER%20IMAGES/shirt3.png'),
(4, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80'),
(5, 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80'),
(6, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'),
(7, 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80'),
(8, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'),
(9, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'),
(10, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80');

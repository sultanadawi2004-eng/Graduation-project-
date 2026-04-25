-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: 25 أبريل 2026 الساعة 21:34
-- إصدار الخادم: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `graduation_project`
--

-- --------------------------------------------------------

--
-- بنية الجدول `ai_insights_cache`
--

CREATE TABLE `ai_insights_cache` (
  `id` int(11) NOT NULL,
  `insight_type` varchar(100) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `ai_insights_cache`
--

INSERT INTO `ai_insights_cache` (`id`, `insight_type`, `payload`, `expires_at`) VALUES
(1, 'sales_forecast', '{\"prediction\": \"Flat White sales are projected to grow by 25% due to upcoming university events.\", \"confidence\": \"high\"}', '2026-12-31 00:00:00'),
(2, 'inventory_alert', '{\"prediction\": \"Coffee Beans stock is low. Based on current trends, it will run out in 2 days.\", \"confidence\": \"very_high\"}', '2026-12-31 00:00:00');

-- --------------------------------------------------------

--
-- بنية الجدول `categories`
--

CREATE TABLE `categories` (
  `id` varchar(50) NOT NULL,
  `label` varchar(255) NOT NULL,
  `icon` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `categories`
--

INSERT INTO `categories` (`id`, `label`, `icon`) VALUES
('espresso', 'Coffee & Espresso', 'fa-mug-hot'),
('food', 'Food & Pastries', 'fa-bread-slice'),
('tea', 'Tea & Other Drinks', 'fa-leaf');

-- --------------------------------------------------------

--
-- بنية الجدول `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL,
  `user_msg` text DEFAULT NULL,
  `ai_msg` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(50) DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `message`, `status`, `created_at`) VALUES
(1, 'Oliver Bennett', 'oliver.b@gmail.com', 'Hi Sophie! I loved the Flat White today. Do you sell your coffee beans in bags? I would love to brew some at home.', 'new', '2026-04-23 14:37:35'),
(2, 'Sophie Harrison', 'sophie.h@outlook.com', 'Hello, I left my umbrella near the window seats this afternoon. Did anyone find it? It is a small blue one.', 'new', '2026-04-23 14:37:35'),
(3, 'George Miller', 'george.m@university.ac.uk', 'I am a student at the university. Do you offer any group discounts for study sessions? We are about 6 people.', 'new', '2026-04-23 14:37:35'),
(4, 'Charlotte Davies', 'charlotte.d@icloud.com', 'The Vegan Pastry was amazing! Could you please let me know the ingredients? I have a specific nut allergy.', 'new', '2026-04-23 14:37:35'),
(5, 'Arthur Wright', 'arthur.w@fastmail.com', 'I am interested in the Barista position mentioned by Sophie. Should I bring my CV in person or is email enough?', 'new', '2026-04-23 14:37:35');

-- --------------------------------------------------------

--
-- بنية الجدول `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `min_threshold` int(11) DEFAULT 10,
  `unit` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `inventory`
--

INSERT INTO `inventory` (`id`, `item_name`, `quantity`, `min_threshold`, `unit`) VALUES
(1, 'Coffee Beans', 14.82, 5, 'KG'),
(2, 'Fresh Milk', 10.90, 10, 'Liters'),
(3, 'Pastry Bags', 99.00, 20, 'Units'),
(4, 'Sugar Sticks', 500.00, 100, 'Pieces'),
(5, 'Paper Cups 12oz', 200.00, 50, 'Pieces'),
(6, 'Chocolate Powder', 5.00, 2, 'KG'),
(7, 'Caramel Syrup', 8.00, 3, 'Bottles'),
(8, 'Cleaning Supplies', 15.00, 5, 'Liters'),
(9, 'Tea Leaves', 9.99, 2, 'KG'),
(10, 'Bread/Buns', 99.00, 20, 'Pieces'),
(11, 'Butter', 19.95, 5, 'KG'),
(12, 'Cheese/Fillings', 29.90, 5, 'KG'),
(13, 'Cake Slices', 48.00, 10, 'Pieces');

-- --------------------------------------------------------

--
-- بنية الجدول `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `category_id` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price_num` decimal(10,2) DEFAULT NULL,
  `price_display` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `menu_items`
--

INSERT INTO `menu_items` (`id`, `category_id`, `name`, `price_num`, `price_display`, `description`, `tags`, `available`) VALUES
(1, 'espresso', 'Espresso', 2.80, '£2.80', 'Single origin shot, clean and bright', 'vegan', 1),
(2, 'espresso', 'Flat White', 3.60, '£3.60', 'Silky microfoam with our house espresso blend', 'vegetarian', 1),
(3, 'espresso', 'Cappuccino', 3.40, '£3.40', 'Equal parts espresso, steamed milk and foam', 'vegetarian', 1),
(4, 'espresso', 'Latte', 3.80, '£3.80', 'Smooth and mellow — our most popular order', 'vegetarian', 1),
(5, 'espresso', 'Long Black', 3.00, '£3.00', 'Double espresso over hot water', 'vegan', 1),
(6, 'espresso', 'Pour-Over Filter', 4.50, '£4.50', 'V60 and seasonal methods', 'vegan', 1),
(7, 'tea', 'Loose Leaf Tea', 3.00, '£3.00', 'Rotating selection of single estate teas', 'vegan', 1),
(8, 'tea', 'Specialty Teas', 3.50, '£3.50', 'Seasonal blends', 'vegan', 1),
(9, 'tea', 'British Hot Chocolate', 4.00, '£4.00', 'Rich cocoa with steamed milk', 'vegan', 1),
(10, 'food', 'Freshly Baked Pastry', 3.50, '£3.50', 'Croissants and daily specials', 'vegetarian', 1),
(11, 'food', 'Cake of the Day', 4.50, '£4.50', 'Seasonal bakes', 'vegetarian', 1),
(12, 'food', 'Sandwich', 6.00, '£6.00', 'Artisan bread with seasonal fillings', 'vegetarian', 1),
(13, 'food', 'Brunch Plate', 8.50, '£8.50', 'Selected days only', 'vegetarian', 1),
(14, 'food', 'Vegan Pastry', 3.50, '£3.50', '100% plant-based daily bake', 'vegan', 1);

-- --------------------------------------------------------

--
-- بنية الجدول `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `discount_percent` int(11) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `offers`
--

INSERT INTO `offers` (`id`, `product_name`, `discount_percent`, `reason`, `end_date`, `active`) VALUES
(1, 'Cappuccino', 15, 'Student Morning Special (8 AM - 11 AM)', '2026-06-30', 1),
(2, 'Freshly Baked Pastry', 50, 'End of Day Clearance Sale', '2026-05-15', 1),
(3, 'Espresso Bundle', 10, 'Corporate Group Order Discount', '2026-12-31', 1),
(4, 'Seasonal Tea', 25, 'Summer Refreshment Promo', '2026-08-01', 1);

-- --------------------------------------------------------

--
-- بنية الجدول `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `email`, `total_amount`, `status`, `created_at`) VALUES
(1, 'Oliver Bennett', 'oliver.b@gmail.com', 6.40, 'ready', '2026-04-23 14:31:55'),
(2, 'Sophie Harrison', 'sophie.h@outlook.com', 7.30, 'ready', '2026-04-23 14:31:55'),
(3, 'George Miller', 'george.m@university.ac.uk', 9.00, 'ready', '2026-04-23 14:31:55'),
(4, 'Charlotte Davies', 'charlotte.d@icloud.com', 7.90, 'ready', '2026-04-23 14:31:55'),
(5, 'Alex', 'Alex@google.com', 3.60, 'ready', '2026-04-24 21:32:48'),
(6, 'Alex', 'Alex@google.com', 6.20, 'ready', '2026-04-24 22:07:27'),
(7, 'Jennifer', 'Jennifer@google.com', 8.00, 'ready', '2026-04-24 22:13:54'),
(8, 'Jennifer', 'Jennifer@google.com', 7.00, 'ready', '2026-04-25 12:09:44'),
(9, 'Jak', 'Jak@coffee.com', 13.30, 'ready', '2026-04-25 14:49:40'),
(10, 'Loka', 'Loka@coffee.com', 23.50, 'ready', '2026-04-25 14:56:08'),
(11, 'John', 'John@google.com', 10.00, 'ready', '2026-04-25 15:11:38'),
(12, 'Antouny', 'Antouny@google.com', 6.50, 'ready', '2026-04-25 15:24:36'),
(13, 'Jaky', 'Jaky@google.com', 13.00, 'completed', '2026-04-25 16:15:55'),
(14, 'Test User', 'test@example.com', 5.60, 'completed', '2026-04-25 16:32:04'),
(15, 'Leo', 'leo@google.com', 7.00, 'completed', '2026-04-25 16:34:46'),
(16, 'Ayle', 'Ayle@google.com', 14.30, 'completed', '2026-04-25 17:27:10');

-- --------------------------------------------------------

--
-- بنية الجدول `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `item_name`, `quantity`, `price`) VALUES
(1, 1, 2, 'Flat White', 1, 3.60),
(2, 1, 1, 'Espresso', 1, 2.80),
(3, 2, 4, 'Latte', 1, 3.80),
(4, 2, 10, 'Freshly Baked Pastry', 1, 3.50),
(5, 3, 6, 'Pour-Over Filter', 2, 4.50),
(6, 4, 3, 'Cappuccino', 1, 3.40),
(7, 4, 11, 'Cake of the Day', 1, 4.50),
(8, 5, 2, 'Flat White', 1, 3.60),
(9, 6, 1, 'Espresso', 1, 2.80),
(10, 6, 3, 'Cappuccino', 1, 3.40),
(11, 7, 9, 'Hot Chocolate', 2, 4.00),
(12, 8, 3, 'Cappuccino', 1, 3.40),
(13, 8, 2, 'Flat White', 1, 3.60),
(14, 9, 10, 'Freshly Baked Pastry', 1, 3.50),
(15, 9, 12, 'Sandwich', 1, 6.00),
(16, 9, 4, 'Latte', 1, 3.80),
(17, 10, 12, 'Sandwich', 2, 6.00),
(18, 10, 10, 'Freshly Baked Pastry', 2, 3.50),
(19, 10, 11, 'Cake of the Day', 1, 4.50),
(20, 11, 2, 'Flat White', 1, 3.60),
(21, 11, 3, 'Cappuccino', 1, 3.40),
(22, 11, 5, 'Long Black', 1, 3.00),
(23, 12, 7, 'Loose Leaf Tea', 1, 3.00),
(24, 12, 8, 'Specialty Teas', 1, 3.50),
(25, 13, 11, 'Cake of the Day', 1, 4.50),
(26, 13, 13, 'Brunch Plate', 1, 8.50),
(27, 14, 1, 'Espresso', 1, 2.80),
(28, 14, 2, 'Flat White', 1, 3.60),
(29, 15, 14, 'Vegan Pastry', 1, 3.50),
(30, 15, 8, 'Specialty Teas', 1, 3.50),
(31, 16, 4, 'Latte', 1, 3.80),
(32, 16, 11, 'Cake of the Day', 1, 4.50),
(33, 16, 12, 'Sandwich', 1, 6.00);

-- --------------------------------------------------------

--
-- بنية الجدول `recipes`
--

CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL,
  `menu_item_id` int(11) DEFAULT NULL,
  `inventory_id` int(11) DEFAULT NULL,
  `quantity_required` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `menu_item_id`, `inventory_id`, `quantity_required`) VALUES
(1, 1, 1, 0.02),
(2, 2, 1, 0.02),
(3, 2, 2, 0.20),
(4, 3, 1, 0.02),
(5, 3, 2, 0.20),
(6, 4, 1, 0.02),
(7, 4, 2, 0.25),
(8, 5, 1, 0.02),
(9, 6, 1, 0.02),
(10, 7, 9, 0.01),
(11, 8, 9, 0.01),
(12, 9, 6, 0.04),
(13, 9, 2, 0.25),
(14, 10, 11, 0.05),
(15, 11, 13, 1.00),
(16, 12, 10, 1.00),
(17, 12, 12, 0.10),
(18, 13, 10, 1.00),
(19, 13, 12, 0.15),
(20, 14, 3, 1.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_insights_cache`
--
ALTER TABLE `ai_insights_cache`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order` (`order_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`),
  ADD KEY `menu_item_id` (`menu_item_id`),
  ADD KEY `inventory_id` (`inventory_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_insights_cache`
--
ALTER TABLE `ai_insights_cache`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- قيود الجداول `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- قيود الجداول `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`),
  ADD CONSTRAINT `recipes_ibfk_2` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

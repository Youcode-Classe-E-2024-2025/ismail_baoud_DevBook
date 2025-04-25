-- Create database
CREATE DATABASE IF NOT EXISTS devbook4;

-- Use database
USE devbook4;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category_id INT,
  is_borrowed BOOLEAN DEFAULT FALSE,
  borrower_id INT DEFAULT NULL,
  borrow_date DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (borrower_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert some default categories
INSERT INTO categories (name) VALUES 
  ('Fiction'),
  ('Non-Fiction'),
  ('Science'),
  ('History'),
  ('Biography'),
  ('Technology');
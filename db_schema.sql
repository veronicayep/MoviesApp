CREATE DATABASE project5;
USE project5;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    surname VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    movie_id INT NOT NULL,
    rating TINYINT NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON UPDATE RESTRICT ON DELETE CASCADE
);
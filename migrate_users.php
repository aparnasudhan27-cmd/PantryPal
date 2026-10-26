<?php
// Run once in the browser after setup.php and update_table.php.
// Safe to run again: it only adds what is missing.
require 'db.php';

$users = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($users)) {
    echo "users table is ready.<br>";
} else {
    exit("Users table error: " . $conn->error);
}

// Add recipes.user_id (owner of the recipe) if it does not exist yet
$check = $conn->query("SHOW COLUMNS FROM recipes LIKE 'user_id'");

if ($check && $check->num_rows === 0) {
    $alter = "ALTER TABLE recipes
              ADD COLUMN user_id INT NULL,
              ADD CONSTRAINT fk_recipes_user
                  FOREIGN KEY (user_id) REFERENCES users(id)
                  ON DELETE SET NULL";

    if ($conn->query($alter)) {
        echo "recipes.user_id column added.<br>";
    } else {
        echo "Could not add user_id: " . $conn->error . "<br>";
    }
} else {
    echo "recipes.user_id already exists.<br>";
}

echo "<p>To make someone an admin, run this in phpMyAdmin:<br>
<code>UPDATE users SET role = 'admin' WHERE email = 'you@example.com';</code></p>";

$conn->close();
?>

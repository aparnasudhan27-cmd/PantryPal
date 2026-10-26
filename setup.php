
<?php
$conn = new mysqli("localhost", "root", "", "", 3306);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

$sql = "CREATE DATABASE IF NOT EXISTS pantry_pal";

if ($conn->query($sql)) {
    $conn->select_db("pantry_pal");

    $table = "CREATE TABLE IF NOT EXISTS recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recipe_name VARCHAR(150) NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        cooking_time INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if ($conn->query($table)) {
        echo "Database and recipes table created successfully!";
    } else {
        echo "Table error: " . $conn->error;
    }
} else {
    echo "Database error: " . $conn->error;
}

$conn->close();
?>

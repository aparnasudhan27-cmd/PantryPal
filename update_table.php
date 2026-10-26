
<?php
require 'db.php';

$sql = "ALTER TABLE recipes
        ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'Other'";

if ($conn->query($sql)) {
    echo "Category column added successfully!";
} else {
    echo "Database update message: " . $conn->error;
}

$conn->close();
?>

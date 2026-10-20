<?php
require 'db.php';

// Allow only POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Invalid request method.");
}

// Get and clean form values
$name = trim($_POST["recipeName"] ?? "");
$ingredients = trim($_POST["recipeIngredients"] ?? "");
$timeText = trim($_POST["cookingTime"] ?? "");
$category = trim($_POST["recipeCategory"] ?? "");
$steps = trim($_POST["recipeSteps"] ?? "");

// Check required fields
if (
    $name === "" ||
    $ingredients === "" ||
    $timeText === "" ||
    $category === "" ||
    $steps === ""
) {
    exit("Please fill in all fields.");
}

// Extract cooking time, e.g. "15 mins" -> 15
if (!preg_match('/^\s*(\d+)\s*(mins?|minutes?)?\s*$/i', $timeText, $matches)) {
    exit("Please enter a valid cooking time, such as 15 mins.");
}

$cookingTime = (int)$matches[1];

if ($cookingTime <= 0 || $cookingTime > 1440) {
    exit("Cooking time must be between 1 and 1440 minutes.");
}

// Insert recipe safely using a prepared statement
$stmt = $conn->prepare(
    "INSERT INTO recipes
    (recipe_name, ingredients, cooking_time, category, instructions)
    VALUES (?, ?, ?, ?, ?)"
);

if (!$stmt) {
    error_log("Recipe prepare error: " . $conn->error);
    exit("Unable to prepare recipe. Please try again.");
}

$stmt->bind_param(
    "ssiss",
    $name,
    $ingredients,
    $cookingTime,
    $category,
    $steps
);

if ($stmt->execute()) {
    echo "Recipe saved successfully!";
    echo '<p><a href="add-recipe.html">Add another recipe</a></p>';
} else {
    error_log("Recipe insert error: " . $stmt->error);
    echo "Unable to save recipe. Please try again.";
}

$stmt->close();
$conn->close();
?>
<?php
require 'db.php';
require 'auth.php';
require_post();
require_login_json();

$id          = (int)($_POST['id'] ?? 0);
$name        = trim($_POST['recipeName'] ?? '');
$ingredients = trim($_POST['recipeIngredients'] ?? '');
$timeText    = trim($_POST['cookingTime'] ?? '');
$category    = trim($_POST['recipeCategory'] ?? '');
$steps       = trim($_POST['recipeSteps'] ?? '');

if ($name === '' || $ingredients === '' || $timeText === '' || $category === '' || $steps === '') {
    json_out(['ok' => false, 'message' => 'Please fill in all fields.']);
}

$allowedCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'];
if (!in_array($category, $allowedCategories, true)) {
    json_out(['ok' => false, 'message' => 'Please choose a valid category.']);
}

$cookingTime = parse_cooking_time($timeText);
if ($cookingTime === null) {
    json_out(['ok' => false, 'message' => 'Enter a cooking time between 1 and 1440 minutes, such as 15 mins.']);
}

// Ownership check: look up the owner first, never trust the id from the browser
$stmt = $conn->prepare("SELECT user_id FROM recipes WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
    json_out(['ok' => false, 'message' => 'Recipe not found.'], 404);
}

if ((int)$row['user_id'] !== current_user_id() && !is_admin()) {
    json_out(['ok' => false, 'message' => 'You can only edit your own recipes.'], 403);
}

$stmt = $conn->prepare(
    "UPDATE recipes
     SET recipe_name = ?, ingredients = ?, cooking_time = ?, category = ?, instructions = ?
     WHERE id = ?"
);
$stmt->bind_param("ssissi", $name, $ingredients, $cookingTime, $category, $steps, $id);

if (!$stmt->execute()) {
    error_log("Recipe update error: " . $stmt->error);
    json_out(['ok' => false, 'message' => 'Could not save your changes. Please try again.'], 500);
}

json_out(['ok' => true, 'message' => 'Recipe updated! Redirecting...']);
?>

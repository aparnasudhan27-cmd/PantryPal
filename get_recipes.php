<?php

header('Content-Type: application/json; charset=utf-8');

require 'db.php';

// Retrieve recipes from the database
$sql = "SELECT id, recipe_name, ingredients, instructions,
               cooking_time, category
        FROM recipes
        ORDER BY id DESC";

$result = $conn->query($sql);

// Return an error if the query fails
if (!$result) {
    http_response_code(500);
    error_log("Recipe retrieval failed: " . $conn->error);

    echo json_encode([
        'error' => 'Unable to retrieve recipes.'
    ]);

    $conn->close();
    exit;
}

$recipes = [];

while ($row = $result->fetch_assoc()) {

    $ingredientList = array_map(
        'trim',
        explode(',', $row['ingredients'])
    );

    $recipes[] = [
        'id' => (int)$row['id'],
        'name' => $row['recipe_name'],
        'ingredients' => $ingredientList,
        'steps' => $row['instructions'],
        'time' => $row['cooking_time'] . ' mins',
        'category' => $row['category'],
        'emoji' => '🍽️'
    ];
}

// Return recipes as JSON
echo json_encode(
    $recipes,
    JSON_UNESCAPED_UNICODE
);

$result->free();
$conn->close();

?>
<?php
require 'db.php';
require 'auth.php';
require_login_json();

$userId = current_user_id();

$stmt = $conn->prepare(
    "SELECT id, recipe_name, ingredients, cooking_time, category
     FROM recipes
     WHERE user_id = ?
     ORDER BY id DESC"
);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$recipes = [];
while ($row = $result->fetch_assoc()) {
    $recipes[] = [
        'id'       => (int)$row['id'],
        'name'     => $row['recipe_name'],
        'ingredients' => $row['ingredients'],
        'time'     => $row['cooking_time'] . ' mins',
        'category' => $row['category']
    ];
}

json_out(['ok' => true, 'recipes' => $recipes]);
?>

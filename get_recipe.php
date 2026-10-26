<?php
// Returns one recipe for the edit form. Only the owner (or an admin) may read it here.
require 'db.php';
require 'auth.php';
require_login_json();

$id = (int)($_GET['id'] ?? 0);

$stmt = $conn->prepare(
    "SELECT id, recipe_name, ingredients, instructions, cooking_time, category, user_id
     FROM recipes WHERE id = ?"
);
$stmt->bind_param("i", $id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();

if (!$row) {
    json_out(['ok' => false, 'message' => 'Recipe not found.'], 404);
}

if ((int)$row['user_id'] !== current_user_id() && !is_admin()) {
    json_out(['ok' => false, 'message' => 'You can only edit your own recipes.'], 403);
}

json_out([
    'ok' => true,
    'recipe' => [
        'id'           => (int)$row['id'],
        'recipeName'   => $row['recipe_name'],
        'ingredients'  => $row['ingredients'],
        'cookingTime'  => $row['cooking_time'] . ' mins',
        'category'     => $row['category'],
        'steps'        => $row['instructions']
    ]
]);
?>

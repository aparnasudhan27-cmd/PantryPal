<?php
require 'db.php';
require 'auth.php';
require_admin_json();

$users = [];
$result = $conn->query(
    "SELECT u.id, u.username, u.email, u.role, u.created_at,
            COUNT(r.id) AS recipe_count
     FROM users u
     LEFT JOIN recipes r ON r.user_id = u.id
     GROUP BY u.id
     ORDER BY u.id"
);
while ($row = $result->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $row['recipe_count'] = (int)$row['recipe_count'];
    $users[] = $row;
}

$recipes = [];
$result = $conn->query(
    "SELECT r.id, r.recipe_name, r.category, u.username AS owner
     FROM recipes r
     LEFT JOIN users u ON u.id = r.user_id
     ORDER BY r.id DESC"
);
while ($row = $result->fetch_assoc()) {
    $row['id'] = (int)$row['id'];
    $recipes[] = $row;
}

json_out([
    'ok' => true,
    'me' => current_user_id(),
    'users' => $users,
    'recipes' => $recipes
]);
?>

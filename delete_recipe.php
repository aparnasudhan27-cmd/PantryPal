<?php
require 'db.php';
require 'auth.php';
require_post();
require_login_json();

$id = (int)($_POST['id'] ?? 0);

$stmt = $conn->prepare("SELECT user_id FROM recipes WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$row) {
    json_out(['ok' => false, 'message' => 'Recipe not found.'], 404);
}

// Owners can delete their own recipes; admins can delete any
if ((int)$row['user_id'] !== current_user_id() && !is_admin()) {
    json_out(['ok' => false, 'message' => 'You can only delete your own recipes.'], 403);
}

$stmt = $conn->prepare("DELETE FROM recipes WHERE id = ?");
$stmt->bind_param("i", $id);

if (!$stmt->execute()) {
    error_log("Recipe delete error: " . $stmt->error);
    json_out(['ok' => false, 'message' => 'Could not delete the recipe.'], 500);
}

json_out(['ok' => true, 'message' => 'Recipe deleted.']);
?>

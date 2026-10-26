<?php
require 'db.php';
require 'auth.php';
require_post();
require_admin_json();

$id = (int)($_POST['id'] ?? 0);

if ($id === current_user_id()) {
    json_out(['ok' => false, 'message' => 'You cannot delete your own account.']);
}

// Their recipes stay on the site (user_id becomes NULL via the foreign key)
$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $id);

if (!$stmt->execute() || $stmt->affected_rows === 0) {
    json_out(['ok' => false, 'message' => 'Could not delete that user.']);
}

json_out(['ok' => true, 'message' => 'User deleted.']);
?>

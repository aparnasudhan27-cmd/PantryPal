<?php
require 'auth.php';

json_out([
    'loggedIn' => (bool) current_user_id(),
    'username' => $_SESSION['username'] ?? null,
    'role'     => $_SESSION['role'] ?? null
]);
?>

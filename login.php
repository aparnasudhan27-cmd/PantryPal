<?php
require 'db.php';
require 'auth.php';
require_post();

$email    = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
    json_out(['ok' => false, 'message' => 'Please enter your email and password.']);
}

$stmt = $conn->prepare("SELECT id, username, password_hash, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Same message for "no such user" and "wrong password"
if (!$user || !password_verify($password, $user['password_hash'])) {
    json_out(['ok' => false, 'message' => 'Incorrect email or password.']);
}

session_regenerate_id(true);
$_SESSION['user_id']  = (int)$user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['role']     = $user['role'];

json_out(['ok' => true, 'message' => 'Welcome back! Redirecting...']);
?>

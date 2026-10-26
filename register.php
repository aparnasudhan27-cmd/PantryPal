<?php
require 'db.php';
require 'auth.php';
require_post();

$username = trim($_POST['username'] ?? '');
$email    = strtolower(trim($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';
$confirm  = $_POST['confirm'] ?? '';

if ($username === '' || $email === '' || $password === '' || $confirm === '') {
    json_out(['ok' => false, 'message' => 'Please fill in all fields.']);
}

if (!preg_match('/^[A-Za-z0-9_]{3,30}$/', $username)) {
    json_out(['ok' => false, 'message' => 'Username must be 3-30 characters: letters, numbers or underscore.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 120) {
    json_out(['ok' => false, 'message' => 'Please enter a valid email address.']);
}

if (strlen($password) < 8) {
    json_out(['ok' => false, 'message' => 'Password must be at least 8 characters.']);
}

if ($password !== $confirm) {
    json_out(['ok' => false, 'message' => 'Passwords do not match.']);
}

// Reject duplicates
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
$stmt->bind_param("ss", $email, $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    json_out(['ok' => false, 'message' => 'That username or email is already registered.']);
}
$stmt->close();

// Never store the plain password
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $hash);

if (!$stmt->execute()) {
    error_log("Register error: " . $stmt->error);
    json_out(['ok' => false, 'message' => 'Could not create your account. Please try again.'], 500);
}

// Log the new user in straight away
session_regenerate_id(true);
$_SESSION['user_id']  = $stmt->insert_id;
$_SESSION['username'] = $username;
$_SESSION['role']     = 'user';

json_out(['ok' => true, 'message' => 'Account created! Redirecting...']);
?>

<?php
// Shared helpers for login sessions and JSON responses (Member 4).
// Include this file at the top of any PHP file that needs to know who is logged in.

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

function json_out($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function current_user_id() {
    return $_SESSION['user_id'] ?? null;
}

function is_admin() {
    return ($_SESSION['role'] ?? '') === 'admin';
}

function require_post() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['ok' => false, 'message' => 'Invalid request method.'], 405);
    }
}

function require_login_json() {
    if (!current_user_id()) {
        json_out(['ok' => false, 'message' => 'Please log in first.'], 401);
    }
}

function require_admin_json() {
    require_login_json();
    if (!is_admin()) {
        json_out(['ok' => false, 'message' => 'Admins only.'], 403);
    }
}

// Turns "15", "15 min" or "15 mins" into 15. Returns null if invalid.
function parse_cooking_time($text) {
    if (!preg_match('/^\s*(\d+)\s*(mins?|minutes?)?\s*$/i', $text, $m)) {
        return null;
    }
    $minutes = (int)$m[1];
    return ($minutes >= 1 && $minutes <= 1440) ? $minutes : null;
}
?>

<?php
require 'auth.php';

$_SESSION = [];
session_destroy();

header('Location: index.html');
exit;
?>

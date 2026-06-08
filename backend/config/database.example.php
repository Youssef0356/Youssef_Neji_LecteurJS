<?php

// Copy this file to database.php and fill in your credentials.
$host     = 'localhost';
$dbname   = 'lecteurjs';
$username = 'YOUR_DB_USER';
$password = 'YOUR_DB_PASSWORD';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("DB connection failed: " . $e->getMessage());
}

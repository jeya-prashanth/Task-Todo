<?php
define('DB_HOST', 'host.docker.internal'); 

define('DB_USER', 'root');
define('DB_PASS', ''); 
define('DB_NAME', 'todo_app');

function getDBConnection() {
    static $conn;
    
    if (!isset($conn)) {
        try {
            $conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            die("Connection failed: " . $e->getMessage());
        }
    }
    
    return $conn;
}
?>

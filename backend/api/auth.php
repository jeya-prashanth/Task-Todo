<?php
require_once __DIR__ . '/../includes/functions.php';

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'signup':
            handleSignup($data);
            break;
            
        case 'login':
            handleLogin($data);
            break;
            
        case 'logout':
            handleLogout();
            break;
            
        default:
            jsonResponse(['error' => 'Invalid action'], 400);
    }
}

function handleSignup($data) {
    $required = ['full_name', 'email', 'password', 'confirm_password'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            jsonResponse(['error' => "$field is required"], 400);
        }
    }
    
    if ($data['password'] !== $data['confirm_password']) {
        jsonResponse(['error' => 'Passwords do not match'], 400);
    }
    
    $db = getDBConnection();
    
    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Email already exists'], 400);
    }
    
    // Create new user
    $stmt = $db->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    $success = $stmt->execute([
        sanitizeInput($data['full_name']),
        filter_var($data['email'], FILTER_SANITIZE_EMAIL),
        $hashedPassword
    ]);
    
    if ($success) {
        $_SESSION['user_id'] = $db->lastInsertId();
        $_SESSION['user_name'] = $data['full_name'];
        jsonResponse(['message' => 'Signup successful', 'user_id' => $_SESSION['user_id']]);
    } else {
        jsonResponse(['error' => 'Failed to create user'], 500);
    }
}

function handleLogin($data) {
    if (empty($data['email']) || empty($data['password'])) {
        jsonResponse(['error' => 'Email and password are required'], 400);
    }
    
    $db = getDBConnection();
    $stmt = $db->prepare("SELECT id, full_name, password FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($data['password'], $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['full_name'];
        jsonResponse(['message' => 'Login successful', 'user_id' => $user['id']]);
    } else {
        jsonResponse(['error' => 'Invalid email or password'], 401);
    }
}

function handleLogout() {
    session_destroy();
    jsonResponse(['message' => 'Logout successful']);
}
?>

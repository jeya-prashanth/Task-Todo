<?php
require_once __DIR__ . '/../includes/functions.php';
requireAuth();

$userId = getCurrentUserId();
$db = getDBConnection();

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get user profile
        $stmt = $db->prepare("SELECT id, full_name, email FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Don't return password hash
            unset($user['password']);
            jsonResponse($user);
        } else {
            jsonResponse(['error' => 'User not found'], 404);
        }
        break;
        
    case 'PUT':
        // Update user profile
        $data = json_decode(file_get_contents('php://input'), true);
        $updates = [];
        $params = [];
        
        if (!empty($data['full_name'])) {
            $updates[] = "full_name = ?";
            $params[] = sanitizeInput($data['full_name']);
        }
        
        if (!empty($data['current_password']) && !empty($data['new_password'])) {
            // Verify current password first
            $stmt = $db->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
            
            if (!$user || !password_verify($data['current_password'], $user['password'])) {
                jsonResponse(['error' => 'Current password is incorrect'], 400);
            }
            
            $updates[] = "password = ?";
            $params[] = password_hash($data['new_password'], PASSWORD_DEFAULT);
        }
        
        if (empty($updates)) {
            jsonResponse(['error' => 'No valid updates provided'], 400);
        }
        
        $params[] = $userId; // For WHERE clause
        
        $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $success = $stmt->execute($params);
        
        if ($success) {
            // Update session name if full_name was changed
            if (!empty($data['full_name'])) {
                $_SESSION['user_name'] = $data['full_name'];
            }
            
            jsonResponse(['message' => 'Profile updated successfully']);
        } else {
            jsonResponse(['error' => 'Failed to update profile'], 500);
        }
        break;
        
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
?>

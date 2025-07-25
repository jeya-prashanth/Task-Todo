<?php
require_once __DIR__ . '/../includes/functions.php';
requireAuth();

$userId = getCurrentUserId();
$db = getDBConnection();

// Handle different HTTP methods
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get user's tasks (limited to 5 most recent)
        $stmt = $db->prepare(
            "SELECT id, title, description, created_at 
             FROM tasks 
             WHERE user_id = ? AND completed = 0 
             ORDER BY created_at DESC 
             LIMIT 5"
        );
        $stmt->execute([$userId]);
        $tasks = $stmt->fetchAll();
        
        jsonResponse($tasks);
        break;
        
    case 'POST':
        // Add a new task
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['title'])) {
            jsonResponse(['error' => 'Title is required'], 400);
        }
        
        $stmt = $db->prepare(
            "INSERT INTO tasks (user_id, title, description) 
             VALUES (?, ?, ?)"
        );
        
        $success = $stmt->execute([
            $userId,
            sanitizeInput($data['title']),
            !empty($data['description']) ? sanitizeInput($data['description']) : ''
        ]);
        
        if ($success) {
            $taskId = $db->lastInsertId();
            $stmt = $db->prepare("SELECT * FROM tasks WHERE id = ?");
            $stmt->execute([$taskId]);
            $newTask = $stmt->fetch();
            
            jsonResponse($newTask, 201);
        } else {
            jsonResponse(['error' => 'Failed to create task'], 500);
        }
        break;
        
    case 'PUT':
        // Mark task as completed
        $taskId = $_GET['id'] ?? 0;
        
        if (empty($taskId)) {
            jsonResponse(['error' => 'Task ID is required'], 400);
        }
        
        // Verify task belongs to user
        $stmt = $db->prepare("SELECT id FROM tasks WHERE id = ? AND user_id = ?");
        $stmt->execute([$taskId, $userId]);
        
        if (!$stmt->fetch()) {
            jsonResponse(['error' => 'Task not found'], 404);
        }
        
        // Mark as completed
        $stmt = $db->prepare("UPDATE tasks SET completed = 1 WHERE id = ?");
        $success = $stmt->execute([$taskId]);
        
        if ($success) {
            jsonResponse(['message' => 'Task marked as completed']);
        } else {
            jsonResponse(['error' => 'Failed to update task'], 500);
        }
        break;
        
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
?>

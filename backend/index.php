<?php
require_once __DIR__ . '/includes/functions.php';

// Check if the request is for an API endpoint
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$is_api_request = strpos($request_uri, '/api/') === 0;

// If it's an API request, let the .htaccess handle it
if ($is_api_request) {
    // This should not be reached as .htaccess should handle API routes
    http_response_code(404);
    echo json_encode(['error' => 'API endpoint not found']);
    exit();
}

// For non-API requests, serve the appropriate HTML page
$path = trim($request_uri, '/');
$valid_routes = ['', 'login', 'signup', 'dashboard', 'profile'];

// Default to dashboard if user is authenticated, otherwise to login
if (empty($path)) {
    if (isAuthenticated()) {
        $path = 'dashboard';
    } else {
        $path = 'login';
    }
}

// If the path is not in valid routes, show 404
if (!in_array($path, $valid_routes)) {
    http_response_code(404);
    include __DIR__ . '/frontend/404.html';
    exit();
}

// Redirect to login if trying to access protected pages while not authenticated
$protected_routes = ['dashboard', 'profile'];
if (in_array($path, $protected_routes) && !isAuthenticated()) {
    header('Location: /login');
    exit();
}

// Redirect to dashboard if trying to access auth pages while authenticated
$auth_routes = ['login', 'signup'];
if (in_array($path, $auth_routes) && isAuthenticated()) {
    header('Location: /dashboard');
    exit();
}

// Serve the appropriate HTML file
$html_file = __DIR__ . "/frontend/{$path}/index.html";

if (file_exists($html_file)) {
    // Inject user data into the HTML if authenticated
    if (isAuthenticated() && in_array($path, $protected_routes)) {
        $user_data = [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name']
        ];
        
        $html = file_get_contents($html_file);
        $html = str_replace(
            '<body>',
            '<body data-user="' . htmlspecialchars(json_encode($user_data)) . '">',
            $html
        );
        
        echo $html;
    } else {
        readfile($html_file);
    }
} else {
    http_response_code(500);
    echo "Error: Could not load the requested page.";
}
?>

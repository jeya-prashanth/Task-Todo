// API Base URL
const API_BASE_URL = '/api';
let currentUser = null;

// DOM Elements
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
const userMenuToggle = document.querySelector('.user-greeting');
const dropdownMenu = document.querySelector('.dropdown-menu');
const logoutBtn = document.getElementById('logout-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check if user data is available
    const userDataElement = document.body.dataset.user;
    if (userDataElement) {
        currentUser = JSON.parse(userDataElement);
        updateUserUI();
    }
    
    // Initialize event listeners
    initEventListeners();
    
    // Load appropriate page content
    loadPageContent();
});

// Initialize all event listeners
function initEventListeners() {
    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', togglePasswordVisibility);
    });
    
    // User menu dropdown
    if (userMenuToggle) {
        userMenuToggle.addEventListener('click', toggleUserMenu);
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu') && dropdownMenu) {
            dropdownMenu.classList.remove('show');
        }
    });
    
    // Form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const taskForm = document.getElementById('task-form');
    const profileForm = document.getElementById('profile-form');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    if (taskForm) taskForm.addEventListener('submit', handleAddTask);
    if (profileForm) profileForm.addEventListener('submit', handleProfileUpdate);
    
    // Toggle edit mode in profile
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', toggleEditMode);
    }
}

// Toggle password visibility
function togglePasswordVisibility(e) {
    const button = e.target.closest('.toggle-password');
    const input = button.previousElementSibling;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    button.querySelector('i').classList.toggle('fa-eye');
    button.querySelector('i').classList.toggle('fa-eye-slash');
}

// Toggle user menu dropdown
function toggleUserMenu(e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
}

// Update UI elements based on user data
function updateUserUI() {
    if (!currentUser) return;
    
    // Update user greeting
    const greetingElements = document.querySelectorAll('.user-greeting span');
    greetingElements.forEach(el => {
        el.textContent = currentUser.name || 'User';
    });
    
    // Update user avatar
    const avatarElements = document.querySelectorAll('.user-avatar, .profile-avatar');
    avatarElements.forEach(el => {
        el.textContent = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
    });
    
    // Update profile form
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    
    if (fullNameInput) fullNameInput.value = currentUser.name || '';
    if (emailInput) emailInput.value = currentUser.email || '';
}

// Load page-specific content
function loadPageContent() {
    // Load tasks if on dashboard
    if (window.location.pathname.includes('dashboard') || window.location.pathname === '/') {
        loadTasks();
    }
    
    // Load profile data if on profile page
    if (window.location.pathname.includes('profile')) {
        loadProfile();
    }
}

// API Request Helper
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.error || 'Something went wrong');
        }
        
        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        showAlert(error.message || 'An error occurred', 'error');
        throw error;
    }
}

// Show alert message
function showAlert(message, type = 'success') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Add alert to the top of the page
    const header = document.querySelector('header') || document.body;
    header.insertBefore(alert, header.firstChild);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Authentication Handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await apiRequest('/auth/login', 'POST', data);
        
        // Store user data
        currentUser = {
            id: response.user_id,
            name: response.name || 'User'
        };
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
    } catch (error) {
        console.error('Login failed:', error);
        showAlert('Invalid email or password', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirm_password: formData.get('confirm_password')
    };
    
    // Simple client-side validation
    if (data.password !== data.confirm_password) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    try {
        await apiRequest('/auth/signup', 'POST', data);
        showAlert('Account created successfully! Please login.', 'success');
        
        // Redirect to login after a short delay
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
    } catch (error) {
        console.error('Signup failed:', error);
        showAlert(error.message || 'Failed to create account', 'error');
    }
}

async function handleLogout() {
    try {
        await apiRequest('/auth/logout', 'POST');
        window.location.href = '/login';
    } catch (error) {
        console.error('Logout failed:', error);
        showAlert('Failed to logout', 'error');
    }
}

// Task Handlers
async function loadTasks() {
    try {
        const tasks = await apiRequest('/tasks');
        renderTasks(tasks);
    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
}

function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;
    
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="text-center">No tasks yet. Add your first task!</p>';
        return;
    }
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.dataset.id = task.id;
        
        taskElement.innerHTML = `
            <div class="task-info">
                <h3>${escapeHtml(task.title)}</h3>
                ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ''}
                <small>${new Date(task.created_at).toLocaleString()}</small>
            </div>
            <button class="btn btn-outline complete-task" data-id="${task.id}">
                Done
            </button>
        `;
        
        taskList.appendChild(taskElement);
    });
    
    // Add event listeners to complete buttons
    document.querySelectorAll('.complete-task').forEach(button => {
        button.addEventListener('click', handleCompleteTask);
    });
}

async function handleAddTask(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        title: formData.get('title'),
        description: formData.get('description')
    };
    
    try {
        await apiRequest('/tasks', 'POST', data);
        form.reset();
        loadTasks();
        showAlert('Task added successfully!', 'success');
    } catch (error) {
        console.error('Failed to add task:', error);
        showAlert('Failed to add task', 'error');
    }
}

async function handleCompleteTask(e) {
    const taskId = e.target.dataset.id;
    
    try {
        await apiRequest(`/tasks/${taskId}`, 'PUT');
        showAlert('Task marked as completed!', 'success');
        loadTasks();
    } catch (error) {
        console.error('Failed to complete task:', error);
        showAlert('Failed to complete task', 'error');
    }
}

// Profile Handlers
async function loadProfile() {
    try {
        const userData = await apiRequest('/users');
        
        // Update form fields
        document.getElementById('full-name').value = userData.full_name || '';
        document.getElementById('email').value = userData.email || '';
        
        // Update current user data
        if (currentUser) {
            currentUser.name = userData.full_name;
            currentUser.email = userData.email;
            updateUserUI();
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
        showAlert('Failed to load profile', 'error');
    }
}

function toggleEditMode() {
    const form = document.getElementById('profile-form');
    const inputs = form.querySelectorAll('input[type="text"], input[type="password"]');
    const editBtn = document.getElementById('edit-profile-btn');
    const saveBtn = document.getElementById('save-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    
    if (form.classList.contains('edit-mode')) {
        // Cancel edit mode
        form.classList.remove('edit-mode');
        inputs.forEach(input => input.readOnly = true);
        editBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
        if (cancelBtn) cancelBtn.style.display = 'none';
        
        // Reset form to original values
        loadProfile();
    } else {
        // Enter edit mode
        form.classList.add('edit-mode');
        inputs.forEach(input => input.readOnly = false);
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const data = {
        full_name: formData.get('full_name'),
        current_password: formData.get('current_password') || undefined,
        new_password: formData.get('new_password') || undefined
    };
    
    // Only include password fields if current password is provided
    if (!data.current_password) {
        delete data.current_password;
        delete data.new_password;
    }
    
    try {
        await apiRequest('/users', 'PUT', data);
        
        // Update current user data
        if (currentUser) {
            currentUser.name = data.full_name;
            updateUserUI();
        }
        
        // Show success message and exit edit mode
        showAlert('Profile updated successfully!', 'success');
        toggleEditMode();
        
        // Clear password fields
        form.querySelectorAll('input[type="password"]').forEach(input => {
            input.value = '';
        });
    } catch (error) {
        console.error('Failed to update profile:', error);
        showAlert(error.message || 'Failed to update profile', 'error');
    }
}

// Utility function to escape HTML
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

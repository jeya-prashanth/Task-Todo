// DOM Elements
const profileForm = document.getElementById('profile-form');
const editBtn = document.getElementById('edit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const profileActions = document.getElementById('profile-actions');
const actionButtons = document.getElementById('action-buttons');

// Form fields and view elements
const fullNameInput = document.getElementById('fullName');
const fullNameView = document.getElementById('fullName-view');
const emailView = document.getElementById('email-view');
const passwordInput = document.getElementById('password');

// User info elements
const userFullName = document.getElementById('user-full-name');
const userEmail = document.getElementById('user-email');
const userInitial = document.getElementById('user-initial');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileInitial = document.getElementById('profile-initial');

// State
let isEditing = false;

// Mock user data
let userData = {
    fullName: 'John Doe',
    email: 'john@example.com'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load user data
    loadUserData();
    
    // Initialize event listeners
    initEventListeners();
});

// Initialize all event listeners
function initEventListeners() {
    // Edit button
    if (editBtn) {
        editBtn.addEventListener('click', toggleEditMode);
    }
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEdit);
    }
    
    // Save button
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSave);
    }
}

// Load user data
function loadUserData() {
    // Update UI with user data
    fullNameView.textContent = userData.fullName;
    emailView.textContent = userData.email;
    
    // Set form values
    if (fullNameInput) {
        fullNameInput.value = userData.fullName;
    }
}

// Update the UI with user data
function updateUserUI(user) {
    if (!user) return;
    
    // Update form fields
    if (fullNameInput) fullNameInput.value = user.full_name || '';
    if (emailInput) emailInput.value = user.email || '';
    
    // Update user info displays
    if (userFullName) userFullName.textContent = user.full_name || 'User';
    if (profileName) profileName.textContent = user.full_name || 'User';
    if (userEmail) userEmail.textContent = user.email || '';
    if (profileEmail) profileEmail.textContent = user.email || '';
    
    // Update user initial
    const initial = user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';
    if (userInitial) userInitial.textContent = initial;
    if (profileInitial) profileInitial.textContent = initial;
    
    // Update avatar if available
    if (user.avatar_url) {
        // In a real app, you would set the avatar image here
        // For now, we'll just update the background color based on the initial
        const hue = stringToHue(user.full_name || 'User');
        const avatarElements = document.querySelectorAll('.user-avatar, .profile-avatar');
        avatarElements.forEach(el => {
            el.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
        });
    }
}

// Toggle edit mode
function toggleEditMode() {
    document.querySelectorAll('.view-mode').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.edit-mode').forEach(el => el.classList.remove('hidden'));
    editBtn.classList.add('hidden');
    actionButtons.classList.remove('hidden');
    
    // Focus on the first input field
    if (fullNameInput) {
        fullNameInput.focus();
    }
}

// Cancel edit and reset form
function cancelEdit() {
    document.querySelectorAll('.view-mode').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.edit-mode').forEach(el => el.classList.add('hidden'));
    editBtn.classList.remove('hidden');
    actionButtons.classList.add('hidden');
    
    // Reset form values
    if (fullNameInput) {
        fullNameInput.value = userData.fullName;
    }
    if (passwordInput) {
        passwordInput.value = '';
    }
    
    // Clear error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

// Validate form
function validateForm() {
    let isValid = true;
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    
    // Validate full name
    if (fullNameInput && fullNameInput.value.trim() === '') {
        const errorEl = document.getElementById('fullName-error');
        if (errorEl) {
            errorEl.textContent = 'Full name is required';
            errorEl.style.display = 'block';
        }
        isValid = false;
    }
    
    // Validate password if provided
    if (passwordInput && passwordInput.value.trim() !== '') {
        if (passwordInput.value.length < 6) {
            const errorEl = document.getElementById('password-error');
            if (errorEl) {
                errorEl.textContent = 'Password must be at least 6 characters';
                errorEl.style.display = 'block';
            }
            isValid = false;
        }
    }
    
    return isValid;
}

// Handle save button click
function handleSave(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Update user data
    if (fullNameInput) {
        userData.fullName = fullNameInput.value.trim();
    }
    
    if (passwordInput && passwordInput.value.trim() !== '') {
        // In a real app, you would hash the password before saving
        console.log('Password changed (not saved in this demo)');
    }
    
    // Update UI
    fullNameView.textContent = userData.fullName;
    
    // Show success message (in a real app, you would show a proper notification)
    alert('Profile updated successfully!');
    
    // Exit edit mode
    cancelEdit();
}

// Handle avatar upload
async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
        showAlert('Please select a valid image file', 'error');
        return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showAlert('Image size should be less than 2MB', 'error');
        return;
    }
    
    try {
        // In a real app, you would upload the file to a server
        // For now, we'll just simulate a successful upload
        
        // Show loading state
        changeAvatarBtn.disabled = true;
        changeAvatarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate a color based on the file name for demo purposes
        const hue = stringToHue(file.name);
        const avatarElements = document.querySelectorAll('.user-avatar, .profile-avatar');
        avatarElements.forEach(el => {
            el.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
        });
        
        // Show success message
        showAlert('Profile picture updated successfully!', 'success');
        
    } catch (error) {
        console.error('Error uploading avatar:', error);
        showAlert('Failed to upload profile picture. Please try again.', 'error');
    } finally {
        // Reset button state
        changeAvatarBtn.disabled = false;
        changeAvatarBtn.innerHTML = '<i class="fas fa-camera"></i>';
        
        // Reset file input
        avatarUpload.value = '';
    }
}

// Handle user logout
async function handleLogout() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error('Failed to logout');
        }
        
        // Redirect to login page
        window.location.href = '/login.html';
        
    } catch (error) {
        console.error('Error logging out:', error);
        showAlert('Failed to logout. Please try again.', 'error');
    }
}
// Show alert message
function showAlert(message, type = 'success') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Add alert to the body
    document.body.insertBefore(alert, document.body.firstChild);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Helper function to generate a consistent color from a string
function stringToHue(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
}

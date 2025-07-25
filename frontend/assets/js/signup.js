// DOM Elements
const signupForm = document.getElementById('signup-form');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    
    // Clear any existing mock user data
    if (localStorage.getItem('mockUser')) {
        localStorage.removeItem('mockUser');
    }
});

// Initialize all event listeners
function initEventListeners() {
    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', togglePasswordVisibility);
    });
    
    // Form submission - using mock data only
    if (signupForm) {
        signupForm.addEventListener('submit', handleMockSignup);
    }
    
    // Password match validation
    if (passwordInput && confirmPasswordInput) {
        [passwordInput, confirmPasswordInput].forEach(input => {
            input.addEventListener('input', validatePasswordMatch);
        });
    }
}

// Toggle password visibility
function togglePasswordVisibility(e) {
    const button = e.currentTarget;
    const input = button.previousElementSibling;
    const icon = button.querySelector('i');
    
    // Toggle input type
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    // Toggle icon
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

// Validate password match
function validatePasswordMatch() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity("Passwords don't match");
    } else {
        confirmPasswordInput.setCustomValidity('');
    }
}

// Handle mock signup form submission
async function handleMockSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const fullName = formData.get('full_name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');
    
    // Client-side validation
    if (!fullName || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert("Passwords don't match", 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user data
    const mockUser = {
        id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
        email: email,
        full_name: fullName,
        created_at: new Date().toISOString()
    };
    
    // Store mock user data in localStorage
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    
    // Show success message
    showAlert('Account created successfully! Redirecting to dashboard...', 'success');
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
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
        if (document.body.contains(alert)) {
            alert.remove();
        }
    }, 5000);
}

// Prevent form submission on Enter key in input fields
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});

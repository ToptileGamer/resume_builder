// =============================
// AUTHENTICATION LOGIC
// =============================

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
  const user = getStoredUser();
  if (user) {
    window.location.href = 'dashboard.html';
  }
});

// Toggle between login and signup forms
function toggleForms() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  loginForm.classList.toggle('active');
  signupForm.classList.toggle('active');

  // Clear messages and fields
  document.getElementById('loginMessage').innerHTML = '';
  document.getElementById('signupMessage').innerHTML = '';
  document.getElementById('loginForm').reset();
  document.getElementById('signupForm').reset();
}

// =============================
// LOGIN HANDLER
// =============================

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const messageEl = document.getElementById('loginMessage');

  // Validation
  if (!email || !password) {
    showMessage(messageEl, 'Please fill in all fields', 'error');
    return;
  }

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email);

  if (!user) {
    showMessage(messageEl, 'Email not found', 'error');
    return;
  }

  // Simple password check (in production, use proper hashing)
  if (!comparePassword(password, user.passwordHash)) {
    showMessage(messageEl, 'Invalid password', 'error');
    return;
  }

  // Login successful
  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem('currentUser', JSON.stringify(sessionUser));
  showMessage(messageEl, 'Login successful! Redirecting...', 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
});

// =============================
// SIGNUP HANDLER
// =============================

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const messageEl = document.getElementById('signupMessage');

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    showMessage(messageEl, 'Please fill in all fields', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showMessage(messageEl, 'Passwords do not match', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage(messageEl, 'Password must be at least 6 characters', 'error');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage(messageEl, 'Please enter a valid email', 'error');
    return;
  }

  // Get existing users
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Check if email already exists
  if (users.some(u => u.email === email)) {
    showMessage(messageEl, 'Email already registered', 'error');
    return;
  }

  // Create new user
  const newUser = {
    id: generateId(),
    name: name,
    email: email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Auto login
  const sessionUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem('currentUser', JSON.stringify(sessionUser));
  showMessage(messageEl, 'Account created! Redirecting...', 'success');

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
});

// =============================
// HELPER FUNCTIONS
// =============================

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `auth-message ${type}`;
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Simple hash function (for demo - use proper hashing in production)
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// Compare password with hash
function comparePassword(password, hash) {
  return hashPassword(password) === hash;
}

// Get stored user from session
function getStoredUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

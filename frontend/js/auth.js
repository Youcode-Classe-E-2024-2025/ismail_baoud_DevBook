function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (token && user) {
    updateUIForLoggedInUser(user);
    return true;
  } else {
    updateUIForLoggedOutUser();
    return false;
  }
}

function updateUIForLoggedInUser(user) {
  const authNavElement = document.getElementById('auth-nav');
  authNavElement.innerHTML = `
    <span>Welcome, ${user.username}</span>
    <a href="#" id="logout-btn" class="nav-link">Logout</a>
  `;
  
  document.getElementById('logout-btn').addEventListener('click', logout);
  
  document.querySelectorAll('.auth-required').forEach(el => {
    el.classList.remove('hide');
  });
  
  const addBookBtn = document.getElementById('add-book-btn');
  const addCategoryBtn = document.getElementById('add-category-btn');
  
  if (addBookBtn) addBookBtn.classList.remove('hide');
  if (addCategoryBtn) addCategoryBtn.classList.remove('hide');
}

function updateUIForLoggedOutUser() {
  const authNavElement = document.getElementById('auth-nav');
  authNavElement.innerHTML = `
    <a href="#" class="nav-link" data-page="login">Login</a>
    <span>/</span>
    <a href="#" class="nav-link" data-page="register">Register</a>
  `;
  
  document.querySelectorAll('.auth-required').forEach(el => {
    el.classList.add('hide');
  });
  
  const addBookBtn = document.getElementById('add-book-btn');
  const addCategoryBtn = document.getElementById('add-category-btn');
  
  if (addBookBtn) addBookBtn.classList.add('hide');
  if (addCategoryBtn) addCategoryBtn.classList.add('hide');
}

async function login(username, password) {
  try {
    const data = await authAPI.login(username, password);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    updateUIForLoggedInUser(data.user);
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

async function register(username, password) {
  try {
    const data = await authAPI.register(username, password);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    updateUIForLoggedInUser(data.user);
    
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

function logout(e) {
  if (e) e.preventDefault();
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  updateUIForLoggedOutUser();
  
  navigateTo('home');
  
  showNotification('You have been logged out', 'info');
}

function initAuth() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        await login(username, password);
        
        loginForm.reset();
        
        navigateTo('home');
        
        showNotification('Login successful', 'success');
      } catch (error) {
        showNotification(error.message || 'Login failed', 'error');
      }
    });
  }
  
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        await register(username, password);
        
        registerForm.reset();
        
        navigateTo('home');
        
        showNotification('Registration successful', 'success');
      } catch (error) {
        showNotification(error.message || 'Registration failed', 'error');
      }
    });
  }
  
  checkAuthStatus();
}
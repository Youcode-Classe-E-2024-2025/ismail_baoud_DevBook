function showNotification(message, type = 'info') {
  const notificationElement = document.getElementById('notification');
  
  notificationElement.className = '';
  notificationElement.classList.add(type);
  notificationElement.classList.add('show');
  notificationElement.textContent = message;
  
  setTimeout(() => {
    notificationElement.classList.remove('show');
  }, 3000);
}

function navigateTo(pageName) {
  const contentElement = document.getElementById('content');
  
  switch (pageName) {
    case 'home':
      contentElement.innerHTML = `
        <div class="welcome-section">
          <h2>Welcome to Simple DevBook</h2>
          <p>Manage your books easily</p>
          <button class="btn primary" onclick="navigateTo('books')">Browse Books</button>
        </div>
      `;
      break;
      
    case 'books':
      contentElement.innerHTML = `
        <div class="books-page">
          <h2>Books</h2>
          <div id="books-list"></div>
        </div>
      `;
      loadBooks();
      break;
      
    case 'categories':
      contentElement.innerHTML = `
        <div class="categories-page">
          <h2>Categories</h2>
          <div id="categories-list"></div>
        </div>
      `;
      loadCategories();
      break;
      
    case 'login':
      contentElement.innerHTML = `
        <div class="auth-form">
          <h2>Login</h2>
          <form id="login-form">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required>
            </div>
            <button type="submit" class="btn primary">Login</button>
          </form>
        </div>
      `;
      break;
      
    case 'register':
      contentElement.innerHTML = `
        <div class="auth-form">
          <h2>Register</h2>
          <form id="register-form">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required>
            </div>
            <div class="form-group">
              <label for="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" required>
            </div>
            <button type="submit" class="btn primary">Register</button>
          </form>
        </div>
      `;
      break;
  }
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageName) {
      link.classList.add('active');
    }
  });
}

function initUI() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute('data-page'));
    });
  });
  
  navigateTo('home');
}
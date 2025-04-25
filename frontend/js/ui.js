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
  document.querySelectorAll('.page, .active-page').forEach(page => {
    page.classList.remove('active-page');
    page.classList.add('page');
  });
  
  const pageElement = document.getElementById(`${pageName}-page`);
  if (pageElement) {
    pageElement.classList.remove('page');
    pageElement.classList.add('active-page');
  }
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  document.querySelectorAll(`.nav-link[data-page="${pageName}"]`).forEach(link => {
    link.classList.add('active');
  });
}

function initUI() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const pageName = link.getAttribute('data-page');
      navigateTo(pageName);
    });
  });
  
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      navigateTo('login');
    });
  }
}
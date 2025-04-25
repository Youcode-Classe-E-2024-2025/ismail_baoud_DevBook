document.addEventListener('DOMContentLoaded', () => {
  initUI();
  
  initAuth();
  
  initBooks();
  
  initCategories();
  
  const currentPage = document.querySelector('.active-page');
  if (currentPage) {
    const pageId = currentPage.id;
    
    if (pageId === 'books-page') {
      renderBooks();
    } else if (pageId === 'categories-page') {
      renderCategories();
    }
  }
});
async function renderBooks() {
  const booksListElement = document.getElementById('books-list');
  
  try {
    booksListElement.innerHTML = '<div class="loading">Loading books...</div>';
    
    const data = await booksAPI.getAll();
    
    if (data.length === 0) {
      booksListElement.innerHTML = `
        <div class="empty-state">
          <p>No books found. Add your first book!</p>
        </div>
      `;
      return;
    }
    
    const booksHTML = data.map(book => {
      const isLoggedIn = !!localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isBookBorrower = isLoggedIn && book.borrower_id === user.id;
      
      let statusHTML = '';
      if (book.is_borrowed) {
        statusHTML = `
          <div class="book-status status-borrowed">
            <span class="material-icons">person</span>
            Borrowed by ${book.borrower_name || 'someone'}
          </div>
        `;
      } else {
        statusHTML = `
          <div class="book-status status-available">
            <span class="material-icons">check_circle</span>
            Available
          </div>
        `;
      }
      
      let actionButtons = '';
      
      if (isLoggedIn) {
        actionButtons += `
          <button class="btn secondary edit-book-btn" data-id="${book.id}">
            <span class="material-icons">edit</span>
          </button>
          <button class="btn danger delete-book-btn" data-id="${book.id}">
            <span class="material-icons">delete</span>
          </button>
        `;
        
        if (!book.is_borrowed) {
          actionButtons += `
            <button class="btn success borrow-book-btn" data-id="${book.id}">
              <span class="material-icons">book</span> Borrow
            </button>
          `;
        } else if (isBookBorrower) {
          actionButtons += `
            <button class="btn warning return-book-btn" data-id="${book.id}">
              <span class="material-icons">assignment_return</span> Return
            </button>
          `;
        }
      }
      
      return `
        <div class="card book-card" data-id="${book.id}">
          <div class="card-header">
            <h3>${book.title}</h3>
          </div>
          <div class="card-body">
            <div class="book-info">
              <p><strong>Author:</strong> ${book.author}</p>
              <p><strong>Category:</strong> ${book.category_name || 'Uncategorized'}</p>
            </div>
            ${statusHTML}
          </div>
          <div class="card-footer">
            <div class="book-actions">
              ${actionButtons}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    booksListElement.innerHTML = booksHTML;
    
    addBookEventListeners();
  } catch (error) {
    console.error('Error rendering books:', error);
    booksListElement.innerHTML = `
      <div class="error-state">
        <p>Error loading books. Please try again.</p>
      </div>
    `;
  }
}

function addBookEventListeners() {
  document.querySelectorAll('.edit-book-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const bookId = button.getAttribute('data-id');
      await openEditBookModal(bookId);
    });
  });
  
  document.querySelectorAll('.delete-book-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const bookId = button.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this book?')) {
        await deleteBook(bookId);
      }
    });
  });
  
  document.querySelectorAll('.borrow-book-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const bookId = button.getAttribute('data-id');
      await borrowBook(bookId);
    });
  });
  
  document.querySelectorAll('.return-book-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const bookId = button.getAttribute('data-id');
      await returnBook(bookId);
    });
  });
}

async function deleteBook(bookId) {
  try {
    await booksAPI.delete(bookId);
    
    showNotification('Book deleted successfully', 'success');
    
    await renderBooks();
  } catch (error) {
    console.error('Error deleting book:', error);
    showNotification(error.message || 'Error deleting book', 'error');
  }
}

async function borrowBook(bookId) {
  try {
    await booksAPI.borrow(bookId);
    
    showNotification('Book borrowed successfully', 'success');
    
    await renderBooks();
  } catch (error) {
    console.error('Error borrowing book:', error);
    showNotification(error.message || 'Error borrowing book', 'error');
  }
}

async function returnBook(bookId) {
  try {
    await booksAPI.return(bookId);
    
    showNotification('Book returned successfully', 'success');
    
    await renderBooks();
  } catch (error) {
    console.error('Error returning book:', error);
    showNotification(error.message || 'Error returning book', 'error');
  }
}

function openAddBookModal() {
  const bookForm = document.getElementById('book-form');
  bookForm.reset();
  
  document.getElementById('book-id').value = '';
  
  document.getElementById('book-modal-title').textContent = 'Add New Book';
  
  populateCategoryDropdown();
  
  document.getElementById('book-modal').classList.add('show');
}

async function openEditBookModal(bookId) {
  try {
    const book = await booksAPI.getById(bookId);
    
    document.getElementById('book-id').value = book.id;
    document.getElementById('book-title').value = book.title;
    document.getElementById('book-author').value = book.author;
    
    await populateCategoryDropdown(book.category_id);
    
    document.getElementById('book-modal-title').textContent = 'Edit Book';
    
    document.getElementById('book-modal').classList.add('show');
  } catch (error) {
    console.error('Error opening edit book modal:', error);
    showNotification(error.message || 'Error loading book details', 'error');
  }
}

async function populateCategoryDropdown(selectedCategoryId = null) {
  try {
    const categorySelect = document.getElementById('book-category');
    
    const categories = await categoriesAPI.getAll();
    
    let optionsHTML = '<option value="">-- Select Category --</option>';
    
    categories.forEach(category => {
      const selected = selectedCategoryId && category.id == selectedCategoryId ? 'selected' : '';
      optionsHTML += `<option value="${category.id}" ${selected}>${category.name}</option>`;
    });
    
    categorySelect.innerHTML = optionsHTML;
  } catch (error) {
    console.error('Error populating category dropdown:', error);
    showNotification(error.message || 'Error loading categories', 'error');
  }
}

async function saveBook() {
  try {
    const bookId = document.getElementById('book-id').value;
    
    const bookData = {
      title: document.getElementById('book-title').value,
      author: document.getElementById('book-author').value,
      category_id: document.getElementById('book-category').value || null
    };
    console.log(bookData);
    
    
    let result;
    if (bookId) {
      result = await booksAPI.update(bookId, bookData);
      showNotification('Book updated successfully', 'success');
    } else {
      result = await booksAPI.create(bookData);
      showNotification('Book added successfully', 'success');
    }
    
    
    document.getElementById('book-modal').classList.remove('show');
    
    await renderBooks();
    
    return result;
  } catch (error) {
    console.error('Error saving book:', error);
    showNotification(error.message || 'Error saving book', 'error');
    throw error;
  }
}

function initBooks() {
  const addBookBtn = document.getElementById('add-book-btn');
  if (addBookBtn) {
    addBookBtn.addEventListener('click', () => {
      openAddBookModal();
    });
  }
  
  const bookForm = document.getElementById('book-form');
  if (bookForm) {
    bookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        const formData = new FormData(bookForm);
        console.log(formData);
        await saveBook(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    });
  }
  
  const cancelBookBtn = document.getElementById('cancel-book-btn');
  if (cancelBookBtn) {
    cancelBookBtn.addEventListener('click', () => {
      document.getElementById('book-modal').classList.remove('show');
    });
  }
  
  const closeButtons = document.querySelectorAll('.close-btn');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('book-modal').classList.remove('show');
      document.getElementById('category-modal').classList.remove('show');
    });
  });
  
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('show');
    }
  });
  
  document.querySelectorAll('.nav-link[data-page="books"]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        renderBooks();
      }, 100);
    });
  });
  
  const browseBtn = document.getElementById('browse-books-btn');
  if (browseBtn) {
    browseBtn.addEventListener('click', () => {
      navigateTo('books');
      setTimeout(() => {
        renderBooks();
      }, 100);
    });
  }
}
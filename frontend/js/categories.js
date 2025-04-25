async function renderCategories() {
  const categoriesTableBody = document.querySelector('#categories-table tbody');
  const tableContainer = document.querySelector('.table-container');
  
  try {
    tableContainer.innerHTML = '<div class="loading">Loading categories...</div>';
    
    const categories = await categoriesAPI.getAll();
    
    tableContainer.innerHTML = `
      <table id="categories-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
    
    const updatedTableBody = document.querySelector('#categories-table tbody');
    
    if (categories.length === 0) {
      updatedTableBody.innerHTML = `
        <tr>
          <td colspan="2" class="empty-message">No categories found. Add your first category!</td>
        </tr>
      `;
      return;
    }
    
    const categoriesHTML = categories.map(category => {
      const isAuthenticated = !!localStorage.getItem('token');
      const deleteButton = isAuthenticated 
        ? `<button class="btn danger delete-category-btn" data-id="${category.id}">
             <span class="material-icons">delete</span>
           </button>`
        : '';
      
      return `
        <tr>
          <td>${category.name}</td>
          <td>
            ${deleteButton}
          </td>
        </tr>
      `;
    }).join('');
    
    updatedTableBody.innerHTML = categoriesHTML;
    
    document.querySelectorAll('.delete-category-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const categoryId = button.getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this category? This might affect books in this category.')) {
          await deleteCategory(categoryId);
        }
      });
    });
  } catch (error) {
    console.error('Error rendering categories:', error);
    tableContainer.innerHTML = `
      <div class="error-state">
        <p>Error loading categories. Please try again.</p>
      </div>
    `;
  }
}

async function deleteCategory(categoryId) {
  try {
    await categoriesAPI.delete(categoryId);
    
    showNotification('Category deleted successfully', 'success');
    
    await renderCategories();
  } catch (error) {
    console.error('Error deleting category:', error);
    
    if (error.message.includes('Cannot delete category that has books')) {
      showNotification('Cannot delete a category that contains books. Reassign or delete the books first.', 'warning');
    } else {
      showNotification(error.message || 'Error deleting category', 'error');
    }
  }
}

async function addCategory(name) {
  try {
    await categoriesAPI.create(name);
    
    showNotification('Category added successfully', 'success');
    
    await renderCategories();
    
    document.getElementById('category-modal').classList.remove('show');
    
    document.getElementById('category-form').reset();
  } catch (error) {
    console.error('Error adding category:', error);
    showNotification(error.message || 'Error adding category', 'error');
  }
}

function initCategories() {
  const addCategoryBtn = document.getElementById('add-category-btn');
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', () => {
      document.getElementById('category-modal').classList.add('show');
    });
  }
  
  const categoryForm = document.getElementById('category-form');
  if (categoryForm) {
    categoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const categoryName = document.getElementById('category-name').value;
      await addCategory(categoryName);
    });
  }
  
  const cancelCategoryBtn = document.getElementById('cancel-category-btn');
  if (cancelCategoryBtn) {
    cancelCategoryBtn.addEventListener('click', () => {
      document.getElementById('category-modal').classList.remove('show');
    });
  }
  
  document.querySelectorAll('.nav-link[data-page="categories"]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        renderCategories();
      }, 100);
    });
  });
}
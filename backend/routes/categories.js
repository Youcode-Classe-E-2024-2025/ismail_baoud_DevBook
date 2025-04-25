import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// Create a new category (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validate inputs
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category already exists
    const existingCategory = await query('SELECT * FROM categories WHERE name = ?', [name]);
    if (existingCategory.length > 0) {
      return res.status(409).json({ message: 'Category already exists' });
    }
    
    // Insert new category
    const result = await query('INSERT INTO categories (name) VALUES (?)', [name]);
    
    res.status(201).json({
      message: 'Category created successfully',
      category: { id: result.insertId, name }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error creating category' });
  }
});

// Delete a category (requires authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Check if the category exists
    const category = await query('SELECT * FROM categories WHERE id = ?', [categoryId]);
    if (category.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if there are books in this category
    const books = await query('SELECT COUNT(*) as count FROM books WHERE category_id = ?', [categoryId]);
    if (books[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category that has books. Reassign or delete the books first.' 
      });
    }
    
    // Delete the category
    await query('DELETE FROM categories WHERE id = ?', [categoryId]);
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error deleting category' });
  }
});

export default router;
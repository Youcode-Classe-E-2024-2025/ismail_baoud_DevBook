import express from 'express';
import { query } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await query(`
      SELECT 
        b.*, 
        c.name as category_name,
        u.username as borrower_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.borrower_id = u.id
      ORDER BY b.title
    `);
    
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error fetching books' });
  }
});

// Get a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    
    const books = await query(`
      SELECT 
        b.*, 
        c.name as category_name,
        u.username as borrower_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.borrower_id = u.id
      WHERE b.id = ?
    `, [bookId]);
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(books[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error fetching book' });
  }
});

// Create a new book (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, author, category_id } = req.body;
    
    // Validate inputs
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }
    
    // Insert new book
    const result = await query(
      'INSERT INTO books (title, author, category_id) VALUES (?, ?, ?)',
      [title, author, category_id || null]
    );
    
    // Fetch the created book with category info
    const newBook = await query(`
      SELECT 
        b.*, 
        c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      message: 'Book created successfully',
      book: newBook[0]
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Server error creating book' });
  }
});

// Update a book (requires authentication)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, category_id } = req.body;
    
    // Validate inputs
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }
    
    // Check if the book exists
    const book = await query('SELECT * FROM books WHERE id = ?', [bookId]);
    if (book.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Update the book
    await query(
      'UPDATE books SET title = ?, author = ?, category_id = ? WHERE id = ?',
      [title, author, category_id || null, bookId]
    );
    
    // Fetch the updated book with category info
    const updatedBook = await query(`
      SELECT 
        b.*, 
        c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `, [bookId]);
    
    res.json({
      message: 'Book updated successfully',
      book: updatedBook[0]
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error updating book' });
  }
});

// Delete a book (requires authentication)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    
    // Check if the book exists
    const book = await query('SELECT * FROM books WHERE id = ?', [bookId]);
    if (book.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Delete the book
    await query('DELETE FROM books WHERE id = ?', [bookId]);
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error deleting book' });
  }
});

// Borrow a book (requires authentication)
router.post('/:id/borrow', authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;
    
    // Check if the book exists
    const books = await query('SELECT * FROM books WHERE id = ?', [bookId]);
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const book = books[0];
    
    // Check if the book is already borrowed
    if (book.is_borrowed) {
      return res.status(400).json({ message: 'Book is already borrowed' });
    }
    
    // Mark the book as borrowed
    await query(
      'UPDATE books SET is_borrowed = TRUE, borrower_id = ?, borrow_date = NOW() WHERE id = ?',
      [userId, bookId]
    );
    
    // Fetch the updated book
    const updatedBook = await query(`
      SELECT 
        b.*, 
        c.name as category_name,
        u.username as borrower_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.borrower_id = u.id
      WHERE b.id = ?
    `, [bookId]);
    
    res.json({
      message: 'Book borrowed successfully',
      book: updatedBook[0]
    });
  } catch (error) {
    console.error('Error borrowing book:', error);
    res.status(500).json({ message: 'Server error borrowing book' });
  }
});

// Return a book (requires authentication)
router.post('/:id/return', authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;
    
    // Check if the book exists
    const books = await query('SELECT * FROM books WHERE id = ?', [bookId]);
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const book = books[0];
    
    // Check if the book is borrowed
    if (!book.is_borrowed) {
      return res.status(400).json({ message: 'Book is not currently borrowed' });
    }
    
    // Check if the current user is the borrower
    if (book.borrower_id !== userId) {
      return res.status(403).json({ message: 'Only the borrower can return this book' });
    }
    
    // Mark the book as returned
    await query(
      'UPDATE books SET is_borrowed = FALSE, borrower_id = NULL, borrow_date = NULL WHERE id = ?',
      [bookId]
    );
    
    // Fetch the updated book
    const updatedBook = await query(`
      SELECT 
        b.*, 
        c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `, [bookId]);
    
    res.json({
      message: 'Book returned successfully',
      book: updatedBook[0]
    });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Server error returning book' });
  }
});

export default router;
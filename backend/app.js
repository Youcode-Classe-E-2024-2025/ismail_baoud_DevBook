const express = require('express');
const app = express();
const path = require('path');
const { sequelize, User, Book, Category, Loan } = require('./models');

const cors = require('cors');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const bcrypt = require('bcryptjs');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Sync all models
        await sequelize.sync({ force: true });
        console.log('All models were synchronized successfully.');

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            email: 'admin@devbook.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// Initialize database
initializeDatabase();

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;

const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'devbook',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

const User = require('./user')(sequelize, DataTypes);
const Book = require('./book')(sequelize, DataTypes);
const Category = require('./category')(sequelize, DataTypes);
const Loan = require('./loan')(sequelize, DataTypes);

Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' });

Loan.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Loan, { foreignKey: 'userId', as: 'loans' });

Loan.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });
Book.hasMany(Loan, { foreignKey: 'bookId', as: 'loans' });

const db = {
    sequelize,
    Sequelize,
    User,
    Book,
    Category,
    Loan
};

module.exports = db;

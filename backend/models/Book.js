module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('available', 'borrowed', 'reserved'),
            defaultValue: 'available'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        publishedYear: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: true
    });

    return Book;
};

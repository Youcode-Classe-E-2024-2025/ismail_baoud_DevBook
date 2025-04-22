module.exports = (sequelize, DataTypes) => {
    const Loan = sequelize.define('Loan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        borrowDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        returnDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'returned', 'overdue'),
            defaultValue: 'active'
        }
    }, {
        timestamps: true
    });

    return Loan;
};

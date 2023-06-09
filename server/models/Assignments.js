const { Sequelize } = require("sequelize");

// Export anonymous function so that can be accesed in other files
module.exports = (sequelize, DataTypes) => {
    // Creating a table in sequelize
    const Assignments = sequelize.define("Assignments", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    })

    return Assignments;
}
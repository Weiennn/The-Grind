const { Sequelize } = require("sequelize");

// Export anonymous function so that can be accesed in other files
module.exports = (sequelize, DataTypes) => {
    // Creating a table in sequelize
    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    // Create association between Users and Assignments by adding userId to the Assignments table
    Users.associate = (models) => {
        // Each user might have multiple assignments
        Users.hasMany(models.Assignments, {
            // When deleting a user, every assignment associated to it gets deleted
            onDelete: 'cascade',
        });
    };

    return Users;
}
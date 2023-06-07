const { Sequelize } = require("sequelize");

// Export anonymous function so that can be accesed in other files
module.exports = (sequelize, DataTypes) => {
    // Creating a table in sequelize
    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    // Create association between Users and Posts by adding postId to the Comments table
    /*Users.associate = (models) => {
        // Each user might have multiple posts
        Users.hasMany(models.Posts, {
            // When deleting a user, every post associated to it gets deleted
            onDelete: 'cascade',
        });
    };*/

    return Users;
}
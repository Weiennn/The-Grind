const { Sequelize } = require("sequelize");

// Export anonymous function so that can be accesed in other files
module.exports = (sequelize, DataTypes) => {
    // Creating a table in sequelize
    const Posts = sequelize.define("Posts", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    // Create association between Posts and Comments by adding postId to the Comments table; models is an object that contains all of the models defined in other files
    Posts.associate = (models) => {
        // Each post might have multiple comments
        Posts.hasMany(models.Comments, {
            // When deleting a post, every comment associated to it gets deleted
            onDelete: 'cascade',
        });
    };

    return Posts;
}
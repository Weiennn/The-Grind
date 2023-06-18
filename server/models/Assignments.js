const { Sequelize } = require("sequelize");
const moment = require("moment");

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
            type: DataTypes.DATEONLY,
            allowNull: false,
            get() {
                return moment(this.getDataValue('deadline')).format('DD.MM.YYYY');
            }
        },
        recurring: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }, 
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    })

    return Assignments;
}

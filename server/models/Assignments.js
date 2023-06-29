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
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      get() {
        return moment(this.getDataValue("deadline")).format("YYYY.MM.DD");
      },
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
    frequency: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  });

  Assignments.associate = (models) => {
    Assignments.belongsTo(models.Users, {
        foreignKey: {
            allowNull: false,
        },
    });

    Assignments.belongsTo(models.Sections, {
        foreignKey: {
            allowNull: true,
        },
    });
    };


  return Assignments;
};

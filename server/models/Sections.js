const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Sections = sequelize.define("Sections", {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  });

  Sections.associate = (models) => {
    Sections.hasMany(models.Assignments, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    
    Sections.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Sections;
};

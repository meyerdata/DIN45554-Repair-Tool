module.exports = (sequelize, Sequelize) => {
    const Produktgruppe = sequelize.define("produktgruppe", {
      produktgruppe_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    }, 
    {
      timestamps: false,
      tableName: 'produktgruppen'
    });
    return Produktgruppe;
  };
  
  // ein Model für die Produktgruppe in der Datenbank
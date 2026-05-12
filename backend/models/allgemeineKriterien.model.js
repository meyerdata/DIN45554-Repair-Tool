module.exports = (sequelize, Sequelize) => {
    const AllgemeineKriterium = sequelize.define("allgemeine_kriterium", {
      allgemeines_kriterium_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      beschreibung: {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    }, {
      timestamps: false, // Falls keine `createdAt` und `updatedAt` Felder
      tableName: 'allgemeine_kriterien' // Der Tabellenname in der Datenbank
    });
  
    return AllgemeineKriterium;
  };
  
  // Ein Datenbankmodel für Allgemeine Kriterien
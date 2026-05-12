module.exports = (sequelize, Sequelize) => {
  const KennzahlProduktkriterien = sequelize.define(
    "kennzahl_produktkriterien",
    {
      kennzahl_produktkriterien_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      allgemeines_kriterium_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "allgemeine_kriterien", // Name der referenzierten Tabelle
          key: "allgemeines_kriterium_id", // Primärschlüssel der referenzierten Tabelle
        },
      },
      kennzahlwert: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      gewichtsfaktor: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      beschreibung: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      produktgruppe_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "produktgruppen", // Name der referenzierten Tabelle
          key: "produktgruppe_id", // Primärschlüssel der referenzierten Tabelle
        },
      },
    },
    {
      timestamps: false,
      tableName: "kennzahl_produktkriterien",
    }
  );
  KennzahlProduktkriterien.associate = (models) => {
    KennzahlProduktkriterien.belongsTo(models.AllgemeineKriterium, {
      foreignKey: "allgemeines_kriterium_id",
      targetKey: "allgemeines_kriterium_id",
      as: "allgemeinesKriterium", // Alias für die Beziehung
    });

    KennzahlProduktkriterien.belongsTo(models.Produktgruppe, {
      foreignKey: "produktgruppe_id",
      targetKey: "produktgruppe_id",
      as: "produktgruppen", // Alias für die Beziehung
    });
  };

  return KennzahlProduktkriterien;
};

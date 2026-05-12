module.exports = (sequelize, Sequelize) => {
  const GewichtderProduktKomponenten = sequelize.define(
    "gewicht_der_produkt_komponenten",
    {
        gewicht_der_produkt_komponenten_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      }, 
        // komponenten_id: {
        // type: Sequelize.INTEGER,
        // references: {
        //     model: "komponenten", // Name der referenzierten Tabelle
        //     key: "komponenten_id", // Primärschlüssel der referenzierten Tabelle
        // },
        // },  
        teil_id: {
        type: Sequelize.INTEGER,
        references: {
            model: "teile", // Name der referenzierten Tabelle
            key: "teil_id", // Primärschlüssel der referenzierten Tabelle
        },
        },  
        gewichtsfaktor: {
        type: Sequelize.FLOAT,
        allowNull: false,
        },
        beschreibung: {
        type: Sequelize.STRING,
        allowNull: false,   
        },
    },
    {
      timestamps: false,
      tableName: "gewicht_der_produkt_komponenten",
    });

   GewichtderProduktKomponenten.associate = (models) => {
    GewichtderProduktKomponenten.belongsTo(models.Teil, {
      foreignKey: "teil_id",
      targetKey: "teil_id",
      as: "teil", // Alias für die Beziehung
    });
    };  
    return GewichtderProduktKomponenten;
}
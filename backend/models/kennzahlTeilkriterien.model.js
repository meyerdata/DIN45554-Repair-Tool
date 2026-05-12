module.exports = (sequelize, Sequelize) => {
    const KennzahlTeilkriterien = sequelize.define(
      "kennzahl_teilkriterien",
      {
        kennzahl_teilkriterien_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        teil_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "teile", // Name der referenzierten Tabelle
            key: "teil_id", // Primärschlüssel der referenzierten Tabelle
          },
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
      version_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "versionen", // Name der referenzierten Tabelle
          key: "version_id", // Primärschlüssel der referenzierten Tabelle
        },
      },  
       },{
        timestamps: false,
        tableName: "kennzahl_teilkriterien",
      }
    );
  
      
    // Definition der Beziehungen
    KennzahlTeilkriterien.associate = (models) => {
      KennzahlTeilkriterien.belongsTo(models.Teil, {
        foreignKey: "teil_id",
        targetKey: "teil_id",
        as: "teil", // Alias für die Beziehung
      });

    KennzahlTeilkriterien.belongsTo(models.AllgemeineKriterium, {
      foreignKey: "allgemeines_kriterium_id",
      targetKey: "allgemeines_kriterium_id",
      as: "allgemeinesKriterium", // Alias für die Beziehung
    });  
    KennzahlTeilkriterien.belongsTo(models.Produktversion, {
      foreignKey: "version_id",
      targetKey: "version_id",
      as: "versionen", // Alias für die Beziehung
    });
    };

     
    return KennzahlTeilkriterien;
  };
  
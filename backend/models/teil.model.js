module.exports = (sequelize, Sequelize) => {
    const Teil = sequelize.define("teil", {
      teil_id: {
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
      },
      produktgruppe_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'produktgruppen',
          key: 'produktgruppe_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    }, {
      timestamps: false,
      tableName: 'teile'
    });
  
    return Teil;
  };

  // ein Model für die Teile in der Datenbank
  
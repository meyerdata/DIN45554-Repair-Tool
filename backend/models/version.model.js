module.exports = (sequelize, Sequelize) => {
    const Version = sequelize.define("version", {
      version_id: {
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
      tableName: 'versionen'
    });
  
    return Version;
  };
  
  // ein Model für die Version in der Datenbank
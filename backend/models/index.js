const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config.js");

// Erstellen einer Sequelize-Instanz mit Datenbankkonfiguration
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port:dbConfig.port,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

// Speichern der Sequelize-Instanz und des Moduls in 'db'
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importieren der Modelle und Hinzufügen zu 'db'
db.Produktgruppe = require("./produktgruppe.model.js")(sequelize, Sequelize);
db.Teil = require("./teil.model.js")(sequelize, Sequelize);
db.Version = require("./version.model.js")(sequelize, Sequelize);
db.AllgemeineKriterium = require("./allgemeineKriterien.model.js")(sequelize, Sequelize);
db.KennzahlProduktkriterien = require("./kennzahlProduktkriterien.model.js")(sequelize, Sequelize);
db.KennzahlTeilkriterien = require("./kennzahlTeilkriterien.model.js")(sequelize, Sequelize);
db.GewichtderProduktKomponenten = require("./gewichtderProduktKomponenten.model.js")(sequelize, Sequelize);





// Die Beziehungen zwischen Tabellen

db.Produktgruppe.hasMany(db.Teil, { foreignKey: 'produktgruppe_id' });
db.Teil.belongsTo(db.Produktgruppe, { foreignKey: 'produktgruppe_id' });

db.Produktgruppe.hasMany(db.Version, { foreignKey: 'produktgruppe_id' });
db.Version.belongsTo(db.Produktgruppe, { foreignKey: 'produktgruppe_id' });






module.exports = db;

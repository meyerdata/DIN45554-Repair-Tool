
// Datenbankverbindung erstellen
module.exports = {
    // HOST: "localhost",  //for local production
    HOST: "db",
    USER: "postgres",
    PASSWORD: "postgres",
    DB: "repairability-tool",
    dialect: "postgres",
    
     port: 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
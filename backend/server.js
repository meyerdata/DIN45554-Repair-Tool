// Express, CORS und Body-Parser-Module importieren
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require("./models"); // Datenbankmodelle importieren

const app = express(); // Express-Anwendung erstellen

var corsOptions = {
  origin: '*',

};
// Middleware einrichten
app.use(cors(corsOptions)); // Aktiviert Cross-Origin Resource Sharing (CORS) für alle Routen
app.use(bodyParser.json()); // Parsen von Anfragen mit JSON-Payload
app.use(bodyParser.urlencoded({ extended: true })); // Parsen von URL-encoded Payloads

// Synchronisieren der Datenbank
db.sequelize.sync({ alter: true }).then(() => {
  // Hier kann man Initialisierungen vornehmen, wie z.B. allgemeine Kriterien
  initializeAllgemeineKriterien();
  console.log('Database synchronized with alter:true');
}).catch(error => {
  console.error('Error synchronizing database:', error);
});

// Importieren der Routen
const produktgruppeRoutes = require("./routes/produktgrupperoutes");
const teilRoutes = require("./routes/teilRoutes");
const versionRoutes = require("./routes/versionRoutes");
const allgemeineKriteriumRoutes = require("./routes/allgemeineKriteriumRoutes");
const kennzahlProduktkriterien = require("./routes/kennzahlProduktkriterienRoutes");
const kennzahlTeilkriterium = require("./routes/kennzahlTeilkriterienRoutes");
const gewichtderProduktKomponentenRoutes = require("./routes/gewichtderKriterienRoutes");



// Routen für die Anwendung registrieren
app.use("/api", produktgruppeRoutes);
app.use("/api", teilRoutes);
app.use("/api", versionRoutes);
app.use("/api", allgemeineKriteriumRoutes);
app.use("/api", kennzahlProduktkriterien);
app.use("/api", kennzahlTeilkriterium);
app.use("/api", gewichtderProduktKomponentenRoutes);



// Port festlegen und Server starten
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server läuft auf Port ${PORT}.`);
});

// Funktion zur Initialisierung der allgemeinen Kriterien
// German Version
// function initializeAllgemeineKriterien() {
//   const allgemeineKriterien = [
//     { name: "Demontagetiefe", beschreibung: "Beschreibung für Demontagetiefe" },
//     { name: "Befestigungselemente", beschreibung: "Beschreibung für Befestigungselemente" },
//     { name: "Werkzeuge", beschreibung: "Beschreibung für Werkzeuge" },
//     { name: "Verfügbarkeiten von Informationen", beschreibung: "Beschreibung für Verfügbarkeiten von Informationen" },
//     { name: "Verfügbarkeit von Ersatzteile", beschreibung: "Beschreibung für Verfügbarkeit von Ersatzteile" },
//     { name: "Verfügbarkeitsdauer von Ersatzteile", beschreibung: "Beschreibung für Verfügbarkeitsdauer von Ersatzteile" },
//     { name: "Diegnose-Sopport und Schnittstelle", beschreibung: "Beschreibung für Diagnose-Support und Schnittstelle" },
//     { name: "Arbeitsumbegung", beschreibung: "Beschreibung für Arbeitsumgebung" },
//     { name: "Datenmanagement", beschreibung: "Beschreibung für Datenmanagement" },
//     { name: "Fähigkeitsniveau", beschreibung: "Beschreibung für Fähigkeitsniveau" }
//   ];


// English version
  function initializeAllgemeineKriterien() {
  const allgemeineKriterien = [
    { name: "Disassembly Depth", beschreibung: "Description of Disassembly Depth" },
    { name: "Fasteners and Connectors", beschreibung: "Description of Fasteners and Connectors" },
    { name: "Tools", beschreibung: "Description of Tools" },
    { name: "Availability of Information", beschreibung: "Description of Availability of Information" },
    { name: "Availability of Spare Parts", beschreibung: "Description of Availability of Spare Parts" },
    { name: "Availability Duration of Spare Parts", beschreibung: "Description of Availability Duration of Spare Parts" },
    { name: "Diagnostic support and interfaces", beschreibung: "Description of Diagnostic support and interfaces" },
    { name: "Working environment", beschreibung: "Description of Working environment" },
    { name: "Data Management", beschreibung: "Description of Data Management" },
    { name: "Skill level", beschreibung: "Description of Skill level" },
    { name: "Return options", beschreibung: "Description of Return options" }
  ];

  // Überprüfen, ob die Kriterien bereits in der Datenbank vorhanden sind, und falls nicht, sie hinzufügen
  allgemeineKriterien.forEach(async kriterium => {
    const existingKriterium = await db.AllgemeineKriterium.findOne({ where: { name: kriterium.name } });
    if (!existingKriterium) {
      await db.AllgemeineKriterium.create(kriterium);
    }
  });
}

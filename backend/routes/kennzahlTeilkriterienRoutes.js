const express = require("express");
const router = express.Router();

const kennzahlTeilkriterienController = require("../controllers/kennzahlTeilkriterienController.js");

router.post("/kennzahl_teilkriterien", kennzahlTeilkriterienController.createKennzahlTeilkriterium); // neue Kennzahl für Teilkriterium erstellen
router.get("/kennzahl_teilkriterien", kennzahlTeilkriterienController.findAllKennzahlTeilkriterien); // alle Kennzahlen für Teilkriterien finden
router.get("/kennzahl_teilkriterien/:id", kennzahlTeilkriterienController.findKennzahlTeilkriteriumById); // eine Kennzahl für Teilkriterium nach ID finden
router.put("/kennzahl_teilkriterien/:id", kennzahlTeilkriterienController.updateKennzahlTeilkriterium); // Kennzahl für Teilkriterium aktualisieren
router.delete("/kennzahl_teilkriterien/:id", kennzahlTeilkriterienController.deleteKennzahlTeilkriterium); // Kennzahl für Teilkriterium löschen

module.exports = router;

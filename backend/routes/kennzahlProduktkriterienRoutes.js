const express = require("express");
const router = express.Router();

const kennzahlProduktkriterienController = require("../controllers/kennzahlProduktkriterienController.js");

router.post("/produktgruppen/:id/kriterien", kennzahlProduktkriterienController.createKennzahlProduktkriterium); // neue Kennzahl für Produktkriterium erstellen
router.get("/kennzahl_produktkriterien", kennzahlProduktkriterienController.findAllKennzahlProduktkriterien); // alle Kennzahlen für Produktkriterien finden
router.get("/kennzahl_produktkriterien/:id", kennzahlProduktkriterienController.findKennzahlProduktkriteriumById); // eine Kennzahl für Produktkriterium nach ID finden
router.put("/kennzahl_produktkriterien/:id", kennzahlProduktkriterienController.updateKennzahlProduktkriterium); // Kennzahl für Produktkriterium aktualisieren
router.delete("/kennzahl_produktkriterien/:id", kennzahlProduktkriterienController.deleteKennzahlProduktkriterium); // Kennzahl für Produktkriterium löschen

module.exports = router;

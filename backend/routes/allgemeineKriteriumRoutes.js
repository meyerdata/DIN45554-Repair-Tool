const express = require("express");
const router = express.Router();

const allgemeineKriteriumController = require("../controllers/allgemeineKriteriumController.js");

router.post("/allgemeine_kriterien", allgemeineKriteriumController.create); // neues Kriterium erstellen
router.get("/allgemeine_kriterien", allgemeineKriteriumController.findAll); // alle Kriterien finden
router.get("/allgemeine_kriterien/:id", allgemeineKriteriumController.findOne); // eine Kriterium nach seine ID finden
router.put("/allgemeine_kriterien/:id", allgemeineKriteriumController.update); // aktualisieren des Kriteriums
router.delete("/allgemeine_kriterien/:id", allgemeineKriteriumController.delete); // Löschen des Kriteriums



module.exports = router;

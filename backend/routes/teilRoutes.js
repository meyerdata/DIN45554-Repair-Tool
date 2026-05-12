const express = require("express");
const router = express.Router();
const teilController = require("../controllers/teilController");

router.post("/teile", teilController.create); //neue erstellen
router.get("/teile", teilController.findAll); // finde alle Teile
router.get("/teile/:id", teilController.findOne); // finde eine Teil nach ID
router.put("/teile/:id", teilController.update); // aktialisiere ein Teil (id)
router.delete("/teile/:id", teilController.delete); // lösche ein Teil (id)

// Route für Teile basierend auf Produktgruppe
router.get('/teile/produktgruppe/:produktgruppe_id', teilController.findByProduktgruppe);

module.exports = router;

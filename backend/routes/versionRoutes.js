const express = require("express");
const router = express.Router();
const versionController = require("../controllers/versionController");

router.post("/versionen", versionController.create); // erstelle neue Version
router.get("/versionen", versionController.findAll); // finde alle Version
router.get("/versionen/:id", versionController.findOne); // finde eine Version
router.put("/versionen/:id", versionController.update); // Aktualisiere eine Version
router.delete("/versionen/:id", versionController.delete); // lösche eine Versin

//rufe alle versionen auf, die zu eine bestimmte Produktgruppe gehören
router.get('/versionen/produktgruppe/:produktgruppeId', versionController.getVersionenByProduktgruppe);

module.exports = router;

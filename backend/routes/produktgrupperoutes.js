const express = require("express");
const router = express.Router();
const produktgruppeController = require("../controllers/produktgruppeController");

router.post("/produktgruppen", produktgruppeController.create); // http://localhost:8080/api/produktgruppen neue erstellen
router.get("/produktgruppen", produktgruppeController.findAll); // http://localhost:8080/api/produktgruppen alle abrufen
router.get("/produktgruppen/:id", produktgruppeController.findOne); // http://localhost:8080/api/produktgruppen/id eine abrufen
router.put("/produktgruppen/:id", produktgruppeController.update); // http://localhost:8080/api/produktgruppen/id aktualisieren 
router.delete("/produktgruppen/:id", produktgruppeController.delete); // http://localhost:8080/api/produktgruppen/id löschen

// Produktgruppe mit Teile und Versionen aufrufen
router.get('/produktgruppen/:produktgruppe_id/details', produktgruppeController.getProduktgruppeMitTeilenUndVersionen); // GET http://localhost:8080/api/produktgruppen/1/details

// soll checken ob eine Produktgruppe schon in der Datenbank sich befindet, wenn dir Benutzer versucht neue Produktgruppe zu erstellen
// die Methode Funktioniert nicht gut. Man muss es verbessern
router.get("/check-duplicate", produktgruppeController.checkDuplicateProduktgruppe);

// eine Produktgruppe mit Teile abrufen
router.get('/produktgruppen/:produktgruppe_id/teile', produktgruppeController.getProduktgruppeMitTeilen);



module.exports = router;

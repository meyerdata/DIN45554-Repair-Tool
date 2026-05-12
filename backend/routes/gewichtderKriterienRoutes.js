const express = require('express');
const router = express.Router();    

const gewichtderProduktKomponentenController = require('../controllers/gewichtderProduktKomponentenController.js');

router.post('/gewicht_der_produkt_komponenten', gewichtderProduktKomponentenController.createGewichtderProduktKomponenten); // neues Gewicht der Produkt Komponenten erstellen
router.get('/gewicht_der_produkt_komponenten', gewichtderProduktKomponentenController.findAllGewichtderProduktKomponenten);
router.get('/gewicht_der_produkt_komponenten/:id', gewichtderProduktKomponentenController.findGewichtderProduktKomponentenById); // ein Gewicht der Produkt Komponenten nach ID finden
router.put('/gewicht_der_produkt_komponenten/:id', gewichtderProduktKomponentenController.updateGewichtderProduktKomponenten); // Gewicht der Produkt Komponenten aktualisieren
router.delete('/gewicht_der_produkt_komponenten/:id', gewichtderProduktKomponentenController.deleteGewichtderProduktKomponenten); // Gewicht der Produkt Komponenten löschen
module.exports = router;
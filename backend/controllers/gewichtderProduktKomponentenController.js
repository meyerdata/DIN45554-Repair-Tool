const db = require("../models");
const Gewichtder_ProduktKomponenten = db.GewichtderProduktKomponenten
exports.createGewichtderProduktKomponenten = (req, res) => {
  if (!req.body.teil_id) {
    res.status(400).send({ message: 'Spezifisches Teil ID darf nicht leer sein!' });
    return;
  } 
    const gewichtderProduktKomponenten = {
    teil_id: req.body.teil_id,
    gewichtsfaktor: req.body.gewichtsfaktor,
    beschreibung: req.body.beschreibung
    };
    Gewichtder_ProduktKomponenten.create(gewichtderProduktKomponenten)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten.' }));
};

exports.findAllGewichtderProduktKomponenten = (req, res) => {
  Gewichtder_ProduktKomponenten.findAll()
    .then(data =>{ res.send(data)})
    .catch(err => {
        res.status(500).send({ 
            message: err.message || 'Ein Fehler ist aufgetreten.' })});
};  

exports.findGewichtderProduktKomponentenById = (req, res) => {
  const id = req.params.id;
  Gewichtder_ProduktKomponenten.findByPk(id)
    .then((data) => (data ? res.send(data) : res.status(404).send({ message: `Gewicht der Produkt Komponenten mit ID ${id} nicht gefunden.` })))
    .catch((err) => res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten.' }));
}
exports.updateGewichtderProduktKomponenten = (req, res) => {
  const id = req.params.id;
  Gewichtder_ProduktKomponenten.update(req.body, { where: { gewicht_der_produkt_komponenten_id: id } })  
    .then((num) =>
        num == 1    
        ? res.send({ message: 'Gewicht der Produkt Komponenten wurde aktualisiert.' })
        : res.send({ message: `Gewicht der Produkt Komponenten mit ID ${id} konnte nicht aktualisiert werden.` })
    )
    .catch((err) => res.status(500).send({ message: err.message || 'Fehler beim Aktualisieren.' }));
}
exports.deleteGewichtderProduktKomponenten = (req, res) => {
  const id = req.params.id;
  Gewichtder_ProduktKomponenten.destroy({ where: { gewicht_der_produkt_komponenten_id: id } })
    .then((num) =>
        num == 1
        ? res.send({ message: 'Gewicht der Produkt Komponenten wurde gelöscht.' })
        : res.send({ message: `Gewicht der Produkt Komponenten mit ID ${id} konnte nicht gelöscht werden.` })
    )
    .catch((err) => res.status(500).send({ message: err.message || 'Fehler beim Löschen.' }));
}   

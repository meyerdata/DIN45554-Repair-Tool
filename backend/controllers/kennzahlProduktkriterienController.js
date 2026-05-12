const db = require("../models");
const Kennzahl_Produktkriterien = db.KennzahlProduktkriterien;

exports.createKennzahlProduktkriterium = (req, res) => {
  if (!req.body.kennzahlwert || !req.body.allgemeines_kriterium_id || !req.body.produktgruppe_id) {
    res.status(400).send({ message: 'Kennzahlwert, Allgemeines kriterium_-ID und produktgruppe-ID dürfen nicht leer sein!' });
    return;
  }
  const kennzahlProduktkriterium = {
    kennzahlwert: req.body.kennzahlwert,
    beschreibung: req.body.beschreibung,
    allgemeines_kriterium_id: req.body.allgemeines_kriterium_id,
    gewichtsfaktor: req.body.gewichtsfaktor,
    produktgruppe_id: req.body.produktgruppe_id
  };
  Kennzahl_Produktkriterien.create(kennzahlProduktkriterium)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten.' }));
};

exports.findAllKennzahlProduktkriterien = (req, res) => {
  Kennzahl_Produktkriterien.findAll()
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten.' }));
};

exports.findKennzahlProduktkriteriumById = (req, res) => {
  const id = req.params.id;
  Kennzahl_Produktkriterien.findByPk(id)
    .then((data) => (data ? res.send(data) : res.status(404).send({ message: `Kennzahl Produktkriterium mit ID ${id} nicht gefunden.` })))
    .catch((err) => res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten.' }));
};

exports.updateKennzahlProduktkriterium = (req, res) => {
  const id = req.params.id;
  Kennzahl_Produktkriterien.update(req.body, { where: { kennzahl_produktkriterium_id: id } })
    .then((num) =>
      num == 1
        ? res.send({ message: 'Kennzahl Produktkriterium wurde aktualisiert.' })
        : res.send({ message: `Kennzahl Produktkriterium mit ID ${id} konnte nicht aktualisiert werden.` })
    )
    .catch((err) => res.status(500).send({ message: err.message || 'Fehler beim Aktualisieren.' }));
};

exports.deleteKennzahlProduktkriterium = (req, res) => {
  const id = req.params.id;
  Kennzahl_Produktkriterien.destroy({ where: { kennzahl_produktkriterium_id: id } })
    .then((num) =>
      num == 1
        ? res.send({ message: 'Kennzahl Produktkriterium wurde gelöscht.' })
        : res.send({ message: `Kennzahl Produktkriterium mit ID ${id} konnte nicht gelöscht werden.` })
    )
    .catch((err) => res.status(500).send({ message: err.message || 'Fehler beim Löschen.' }));
};

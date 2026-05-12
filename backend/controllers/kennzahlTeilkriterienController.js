const db = require("../models");
const Kennzahl_Teilkriterien = db.KennzahlTeilkriterien

exports.createKennzahlTeilkriterium = (req, res) => {
  // if (!req.body.teil_id || !req.body.allgemeines_kriterium_id || !req.body.version_id) {
  if (!req.body.teil_id) {
    res.status(400).send({ message: 'Spezifisches Teilkriterium ID darf nicht leer sein!' });
    return;
  }
  const kennzahlTeilkriterium = {
    teil_id: req.body.teil_id,
    allgemeines_kriterium_id: req.body.allgemeines_kriterium_id,
    version_id: req.body.version_id,
    beschreibung: req.body.beschreibung,
    gewichtsfaktor: req.body.gewichtsfaktor,
    kennzahlwert: req.body.kennzahlwert
  };
  Kennzahl_Teilkriterien.create(kennzahlTeilkriterium)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten.' }));
};

exports.findAllKennzahlTeilkriterien = (req, res) => {
  Kennzahl_Teilkriterien.findAll()
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten.' }));
};

exports.findKennzahlTeilkriteriumById = (req, res) => {
  const id = req.params.id;
  Kennzahl_Teilkriterien.findByPk(id)
    .then((data) => (data ? res.send(data) : res.status(404).send({ message: `Kennzahl Teilkriterium mit ID ${id} nicht gefunden.` })))
    .catch((err) => res.status(500).send({ message: err.message || 'Ein Fehler ist aufgetreten.' }));
};

exports.updateKennzahlTeilkriterium = (req, res) => {
  const id = req.params.id;
  Kennzahl_Teilkriterien.update(req.body, { where: { kennzahl_teilkriterium_id: id } })
    .then((num) =>
      num == 1
        ? res.send({ message: 'Kennzahl Teilkriterium wurde aktualisiert.' })
        : res.send({ message: `Kennzahl Teilkriterium mit ID ${id} konnte nicht aktualisiert werden.` })
    )
    .catch((err) => res.status(500).send({ message: err.message || 'Fehler beim Aktualisieren.' }));
};

exports.deleteKennzahlTeilkriterium = (req, res) => {
  const id = req.params.id;
  Kennzahl_Teilkriterien.destroy({ where: { kennzahl_teilkriterium_id: id } })
    .then((num) =>
      num == 1
        ? res.send({ message: 'Kennzahl Teilkriterium wurde gelöscht.' })
        : res.send({ message: `Kennzahl Teilkriterium mit ID ${id} konnte nicht gelöscht werden.` })
    )
    .catch((err) => res.status(500).send({ message: err.message || 'Fehler beim Löschen.' }));
};

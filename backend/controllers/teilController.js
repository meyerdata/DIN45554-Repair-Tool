const db = require("../models");
const Teil = db.Teil;

// Neues Teil erstellen
exports.create = (req, res) => {
  const teil = {
    name: req.body.name,
    beschreibung: req.body.beschreibung || null,
    produktgruppe_id: req.body.produktgruppe_id
  };

  Teil.create(teil)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Erstellen des Teils aufgetreten."
      });
    });
};

// Alle Teile abrufen
exports.findAll = (req, res) => {
  Teil.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Abrufen der Teile aufgetreten."
      });
    });
};

// Ein Teil nach ID abrufen
exports.findOne = (req, res) => {
  const id = req.params.id;

  Teil.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Teil mit ID ${id} wurde nicht gefunden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Abrufen des Teils aufgetreten."
      });
    });
};

// Teil aktualisieren
exports.update = (req, res) => {
  const id = req.params.id;

  // Entferne `bewertung_id` falls es im Body vorhanden ist
  const teil = { ...req.body };
  delete teil.bewertung_id;

  Teil.update(teil, {
    where: { teil_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Teil wurde erfolgreich aktualisiert."
        });
      } else {
        res.send({
          message: `Teil mit ID ${id} konnte nicht aktualisiert werden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Aktualisieren des Teils aufgetreten."
      });
    });
};

// Teil löschen
exports.delete = (req, res) => {
  const id = req.params.id;

  Teil.destroy({
    where: { teil_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Teil wurde erfolgreich gelöscht."
        });
      } else {
        res.send({
          message: `Teil mit ID ${id} konnte nicht gelöscht werden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Löschen des Teils aufgetreten."
      });
    });
};

// Teile für eine bestimmte Produktgruppe abrufen
exports.findByProduktgruppe = (req, res) => {
  const produktgruppeId = req.params.produktgruppe_id;

  Teil.findAll({
    where: { produktgruppe_id: produktgruppeId }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "Ein Fehler ist beim Abrufen der Teile aufgetreten."
    });
  });
};


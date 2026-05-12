const db = require("../models");
const AllgemeineKriterium = db.AllgemeineKriterium;

// Neues Kriterium erstellen
exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Name darf nicht leer sein!"
    });
    return;
  }

  // Kriterium erstellen
  const kriterium = {
    name: req.body.name,
    beschreibung: req.body.beschreibung
  };

  // Kriterium in der Datenbank speichern
  AllgemeineKriterium.create(kriterium)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist aufgetreten beim Erstellen des Kriteriums."
      });
    });
};

// Alle Kriterien abrufen
exports.findAll = (req, res) => {
  AllgemeineKriterium.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist aufgetreten beim Abrufen der Kriterien."
      });
    });
};

// Ein Kriterium nach ID abrufen
exports.findOne = (req, res) => {
  const id = req.params.id;

  AllgemeineKriterium.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Kriterium mit der ID ${id} wurde nicht gefunden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist aufgetreten beim Abrufen des Kriteriums."
      });
    });
};

// Kriterium aktualisieren
exports.update = (req, res) => {
  const id = req.params.id;

  AllgemeineKriterium.update(req.body, {
    where: { allgemeines_kriterium_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Kriterium wurde erfolgreich aktualisiert."
        });
      } else {
        res.send({
          message: `Kriterium mit der ID ${id} konnte nicht aktualisiert werden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist aufgetreten beim Aktualisieren des Kriteriums."
      });
    });
};

// Kriterium löschen
exports.delete = (req, res) => {
  const id = req.params.id;

  AllgemeineKriterium.destroy({
    where: { allgemeines_kriterium_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Kriterium wurde erfolgreich gelöscht."
        });
      } else {
        res.send({
          message: `Kriterium mit der ID ${id} konnte nicht gelöscht werden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist aufgetreten beim Löschen des Kriteriums."
      });
    });
};



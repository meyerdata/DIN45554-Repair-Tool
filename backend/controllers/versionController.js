const db = require("../models");
const Version = db.Version;

// Neue Version erstellen
exports.create = (req, res) => {
  const version = {
    name: req.body.name,
    beschreibung: req.body.beschreibung || null,
    produktgruppe_id: req.body.produktgruppe_id
  };

  Version.create(version)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Erstellen der Version aufgetreten."
      });
    });
};

// Alle Versionen abrufen
exports.findAll = (req, res) => {
  Version.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Abrufen der Versionen aufgetreten."
      });
    });
};

// Eine Version nach ID abrufen
exports.findOne = (req, res) => {
  const id = req.params.id;

  Version.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Version mit ID ${id} wurde nicht gefunden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Abrufen der Version aufgetreten."
      });
    });
};

// Version aktualisieren
exports.update = (req, res) => {
  const id = req.params.id;

  // Entferne bewertung_id aus req.body falls es gesendet wurde
  const version = { ...req.body };
  delete version.bewertung_id;

  Version.update(version, {
    where: { version_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Version wurde erfolgreich aktualisiert."
        });
      } else {
        res.send({
          message: `Version mit ID ${id} konnte nicht aktualisiert werden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Aktualisieren der Version aufgetreten."
      });
    });
};

// Version löschen
exports.delete = (req, res) => {
  const id = req.params.id;

  Version.destroy({
    where: { version_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Version wurde erfolgreich gelöscht."
        });
      } else {
        res.send({
          message: `Version mit ID ${id} konnte nicht gelöscht werden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Löschen der Version aufgetreten."
      });
    });
};

exports.getVersionenByProduktgruppe = (req, res) => {
  const produktgruppeId = req.params.produktgruppeId;

  // Logge die empfangene produktgruppeId, um sicherzustellen, dass sie korrekt ist
  console.log('Produktgruppe ID im Backend:', produktgruppeId);

  // Überprüfen, ob produktgruppeId vorhanden ist und eine Zahl ist
  if (!produktgruppeId || isNaN(produktgruppeId)) {
    return res.status(400).send({ message: 'Ungültige Produktgruppen-ID' });
  }

  // Teste die Typumwandlung
  const produktgruppeIdAsNumber = parseInt(produktgruppeId, 10);
  console.log('Produktgruppe ID als Zahl:', produktgruppeIdAsNumber);

  // Finde alle Versionen, die zur angegebenen Produktgruppe gehören
  Version.findAll({
    where: { produktgruppe_id: produktgruppeIdAsNumber }  // Filter nach produktgruppe_id
  })
  .then(versions => {
    console.log('Gefilterte Versionen:', versions);  // Überprüfe die gefilterten Versionen
    res.send(versions);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "Ein Fehler ist beim Abrufen der Versionen aufgetreten."
    });
  });
};





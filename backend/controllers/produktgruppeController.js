const db = require("../models");
const Produktgruppe = db.Produktgruppe;
const Teil = db.Teil;
const Version = db.Version;

// Neue Produktgruppe erstellen
exports.create = (req, res) => {
  const produktgruppe = {
    name: req.body.name
  };

  Produktgruppe.create(produktgruppe)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Erstellen der Produktgruppe aufgetreten."
      });
    });
};

// Alle Produktgruppen abrufen
exports.findAll = (req, res) => {
  Produktgruppe.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Abrufen der Produktgruppen aufgetreten."
      });
    });
};

// Produktgruppe nach ID abrufen
exports.findOne = (req, res) => {
  const id = req.params.id;

  Produktgruppe.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Produktgruppe mit ID ${id} wurde nicht gefunden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Abrufen der Produktgruppe aufgetreten."
      });
    });
};

// Produktgruppe aktualisieren
exports.update = (req, res) => {
  const id = req.params.id;

  // Entferne bewertung_id, falls es im Body vorhanden ist
  const produktgruppe = { ...req.body };
  delete produktgruppe.bewertung_id;

  Produktgruppe.update(produktgruppe, {
    where: { produktgruppe_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Produktgruppe wurde erfolgreich aktualisiert."
        });
      } else {
        res.send({
          message: `Produktgruppe mit ID ${id} konnte nicht aktualisiert werden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Aktualisieren der Produktgruppe aufgetreten."
      });
    });
};

// Produktgruppe löschen
exports.delete = (req, res) => {
  const id = req.params.id;

  Produktgruppe.destroy({
    where: { produktgruppe_id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Produktgruppe wurde erfolgreich gelöscht."
        });
      } else {
        res.send({
          message: `Produktgruppe mit ID ${id} konnte nicht gelöscht werden.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ein Fehler ist beim Löschen der Produktgruppe aufgetreten."
      });
    });
};

// Funktion zum Abrufen der Produktgruppe mit ihren Teilen und Versionen
exports.getProduktgruppeMitTeilenUndVersionen = async (req, res) => {
  try {
    const produktgruppeId = req.params.produktgruppe_id;

    // Produktgruppe mit zugehörigen Teilen und Versionen laden
    const produktgruppe = await Produktgruppe.findOne({
      where: { produktgruppe_id: produktgruppeId },
      include: [
        { model: Teil },   // Kein Alias, Standardbeziehung wird verwendet
        { model: Version } // Kein Alias, Standardbeziehung wird verwendet
      ]
    });

    if (produktgruppe) {
      res.json(produktgruppe);
    } else {
      res.status(404).json({ message: 'Produktgruppe nicht gefunden' });
    }
  } catch (error) {
    console.error('Fehler:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Produktgruppe' });
  }
};

// Überprüfung auf duplizierte Produktgruppe
exports.checkDuplicateProduktgruppe = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Produktgruppenname muss angegeben werden." });
  }

  try {
    const produktgruppe = await Produktgruppe.findOne({
      where: {
        name: name, 
      },
    });

    if (produktgruppe) {
      return res.status(409).json({ message: "Die Produktgruppe existiert bereits." });
    } else {
      return res.status(200).json({ message: "Die Produktgruppe ist verfügbar." });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Fehler beim Überprüfen auf Duplikate",
      error: error.message,
    });
  }
};


// Funktion zum Abrufen der Teile für eine bestimmte Produktgruppe
exports.getProduktgruppeMitTeilen = async (req, res) => {
  const produktgruppeId = req.params.produktgruppe_id;

  try {
    const produktgruppe = await Produktgruppe.findOne({
      where: { produktgruppe_id: produktgruppeId },
      include: [Teil]  
    });

    if (produktgruppe) {
      console.log("Produktgruppe gefunden:", produktgruppe);  // Produktgruppe-Daten loggen
      console.log("Teile gefunden:", produktgruppe.teils);    // Teile-Daten loggen
      res.json(produktgruppe.teils);                          // Teile zurückgeben
    } else {
      res.status(404).json({ message: 'Produktgruppe nicht gefunden' });
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Teile:', error);  // Den genauen Fehler loggen
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Teile', error: error.message });
  }
};





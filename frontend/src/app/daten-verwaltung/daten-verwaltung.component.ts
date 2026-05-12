import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'; // Importiert den Service zur Datenverarbeitung
import { FormsModule } from '@angular/forms'; // Importiert das FormsModule für die Formularerstellung
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importiert den Router für Navigation
import { RouterModule } from '@angular/router'; // Importiert das RouterModule für Routing

@Component({
  selector: 'app-daten-verwaltung',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './daten-verwaltung.component.html', // Pfad zur HTML-Vorlage
  styleUrls: ['./daten-verwaltung.component.css'] // Pfad zur CSS-Datei
})
export class DatenVerwaltungComponent implements OnInit {
  auswahlOption: string = 'erstellen'; // Auswahl für den Radiobutton (erstellen oder bearbeiten)
  produktgruppenName: string = ''; // Name der zu erstellenden Produktgruppe
  produktgruppen: any[] = []; // Array zur Speicherung der Produktgruppen
  produktgruppeID: number | null = null; // Speichert die ID der erstellten oder ausgewählten Produktgruppe
  teile: { teil_id?: number, name: string, beschreibung?: string }[] = []; // Array zur Speicherung der Teile mit optionaler ID
  versionen: { version_id?: number, name: string, beschreibung?: string }[] = []; // Array zur Speicherung der Versionen mit optionaler ID
  formularAnzeigen: boolean = true; // Steuert das Anzeigen des Formulars
  speichernErfolgreich: boolean = false; // Steuert das Anzeigen der Erfolgsmeldung
  produktgruppeZumBearbeiten: any = null; // Speichert die Produktgruppe zum Bearbeiten

  produktgruppeErstellt: string | null = null; // Steuert die Nachricht nach dem Erstellen der Produktgruppe

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadProduktgruppen(); // Lädt die Produktgruppen beim Initialisieren der Komponente
  }

  // Produktgruppen aus dem Backend laden
  loadProduktgruppen(): void {
    this.dataService.getProduktgruppen().subscribe({
      next: (data) => {
        this.produktgruppen = data; // Speichert die geladenen Produktgruppen im lokalen Array
      },
      error: (error) => {
        console.error('Error loading product groups:', error); // Fehlerbehandlung
      }
    });
  }

  // Produktgruppe erstellen
  createProduktgruppe(): void {
    if (this.produktgruppenName.trim() === '') { // Überprüft, ob der Name der Produktgruppe leer ist
      alert('Please name the product group.');
      return;
    }

    const neueProduktgruppe = { name: this.produktgruppenName }; // Erstellt ein Objekt für die neue Produktgruppe

    this.dataService.addProduktgruppe(neueProduktgruppe).subscribe({
      next: (response) => {
        console.log('Product group successfully created:', response);
        this.produktgruppen.push(response); // Fügt die neue Produktgruppe zum lokalen Array hinzu
        this.produktgruppeID = response.produktgruppe_id; // Speichert die ID der neu erstellten Produktgruppe
        this.produktgruppeErstellt = `Product group "${this.produktgruppenName}" created. Please add parts and versions.`; // Setzt die Erfolgsmeldung
        this.produktgruppenName = ''; // Setzt das Eingabefeld für den Namen zurück
        this.formularAnzeigen = true; // Zeigt das Formular an
        this.speichernErfolgreich = false; // Setzt die Erfolgsmeldung zurück
      },
      error: (error) => {
        console.error('Error Creating Product Group:', error);
        alert('Error Creating Product Group.');
      }
    });
  }

  // Teil zur Liste hinzufügen
  addTeil(): void {
    this.teile.push({ name: '', beschreibung: '' }); // Fügt ein neues leeres Teil zur Liste hinzu
  }

  // Teil entfernen (nur im Frontend, für noch nicht gespeicherte Teile)
  removeTeilImFrontend(index: number): void {
    this.teile.splice(index, 1); // Entfernt das Teil aus der Liste, bevor es in der Datenbank gespeichert wird
  }

  // Version zur Liste hinzufügen
  addVersion(): void {
    this.versionen.push({ name: '', beschreibung: '' }); // Fügt eine neue leere Version zur Liste hinzu
  }

  // Version entfernen (nur im Frontend, für noch nicht gespeicherte Versionen)
  removeVersionImFrontend(index: number): void {
    this.versionen.splice(index, 1); // Entfernt die Version aus der Liste, bevor sie in der Datenbank gespeichert wird
  }

  // Teil entfernen (bereits gespeicherte Teile, inkl. Datenbanklöschung)
  removeTeil(index: number): void {
    const teil = this.teile[index];
    if (teil.teil_id) {
      this.dataService.deleteTeil(teil.teil_id).subscribe({
        next: () => {
          console.log('Part successfully deleted'); // Erfolgreich aus der Datenbank gelöscht
        },
        error: (error) => {
          console.error('Error deleting part:', error); // Fehlerbehandlung
        }
      });
    }
    this.teile.splice(index, 1); // Entfernt das Teil auch aus der UI
  }

  // Version entfernen (bereits gespeicherte Versionen, inkl. Datenbanklöschung)
  removeVersion(index: number): void {
    const version = this.versionen[index];
    if (version.version_id) {
      this.dataService.deleteVersion(version.version_id).subscribe({
        next: () => {
          console.log('Version successfully deleted'); // Erfolgreich aus der Datenbank gelöscht
        },
        error: (error) => {
          console.error('Error deleting version:', error); // Fehlerbehandlung
        }
      });
    }
    this.versionen.splice(index, 1); // Entfernt die Version auch aus der UI
  }

  // Teile und Versionen speichern oder aktualisieren
  saveTeileUndVersionen(): void {
    if (this.produktgruppeID) {
      // Teile speichern oder aktualisieren
      this.teile.forEach((teil) => {
        const neuesTeil = {
          name: teil.name,
          beschreibung: teil.beschreibung,
          produktgruppe_id: this.produktgruppeID
        };

        if (teil.teil_id) {
          // Teil aktualisieren
          this.dataService.updateTeil(teil.teil_id, neuesTeil).subscribe({
            next: (response) => {
              console.log('Part successfully updated:', response);
            },
            error: (error) => {
              console.error('Error updating part:', error); // Fehlerbehandlung
            }
          });
        } else {
          // Neues Teil hinzufügen
          this.dataService.addTeil(neuesTeil).subscribe({
            next: (response) => {
              console.log('Part added successfully:', response);
            },
            error: (error) => {
              console.error('Error adding part:', error); // Fehlerbehandlung
            }
          });
        }
      });

      // Versionen speichern oder aktualisieren
      this.versionen.forEach((version) => {
        const neueVersion = {
          name: version.name,
          beschreibung: version.beschreibung,
          produktgruppe_id: this.produktgruppeID
        };

        if (version.version_id) {
          // Version aktualisieren
          this.dataService.updateVersion(version.version_id, neueVersion).subscribe({
            next: (response) => {
              console.log('Version successfully updated:', response);
            },
            error: (error) => {
              console.error('Error updating version:', error); // Fehlerbehandlung
            }
          });
        } else {
          // Neue Version hinzufügen
          this.dataService.addVersion(neueVersion).subscribe({
            next: (response) => {
              console.log('Version succesfully added:', response);
            },
            error: (error) => {
              console.error('Error adding version:', error); // Fehlerbehandlung
            }
          });
        }
      });

      // Formular ausblenden und Erfolgsmeldung anzeigen
      this.formularAnzeigen = false;
      this.speichernErfolgreich = true;
    } else {
      alert('Please add a product group first.');
    }
  }

  // Bearbeitungsmodus für vorhandene Produktgruppen auswählen
  produktgruppeBearbeiten(produktgruppe: any): void {
    this.produktgruppeZumBearbeiten = produktgruppe; // Setzt die Produktgruppe zum Bearbeiten
    this.produktgruppeID = produktgruppe.produktgruppe_id;

    if (this.produktgruppeID !== null) {
      // Lade Produktgruppe mit Teilen und Versionen
      this.dataService.getProduktgruppeMitTeilenUndVersionen(this.produktgruppeID).subscribe({
        next: (response) => {
          this.teile = response.teils || []; // Teile zuweisen, wenn vorhanden
          this.versionen = response.versions || []; // Versionen zuweisen, wenn vorhanden
          this.formularAnzeigen = true; // Zeigt das Formular an
        },
        error: (error) => {
          console.error('Error Loading Product Group', error); // Fehlerbehandlung
        }
      });
    } else {
      console.error('Product Group ID is zero');
    }
  }

  // Produktgruppe löschen
  deleteProduktgruppe(produktgruppe: any): void {
    if (confirm(`Do you want to delete product group "${produktgruppe.name}"?`)) {
      this.dataService.deleteProduktgruppe(produktgruppe.produktgruppe_id).subscribe({
        next: () => {
          console.log('Product group deleted successfully');
          this.loadProduktgruppen(); // Produktgruppen neu laden
        },
        error: (error) => {
          console.error('Error deleting product group:', error); // Fehlerbehandlung
        }
      });
    }
  }

  // Formular zurücksetzen, wenn der Benutzer die Ansicht wechselt
  resetForm(): void {
    this.formularAnzeigen = true;
    this.speichernErfolgreich = false;
    this.produktgruppenName = '';
    this.teile = [];
    this.versionen = [];
    this.produktgruppeZumBearbeiten = null; // Zurücksetzen der Variable
    this.produktgruppeErstellt = null; // Nachricht zurücksetzen
    this.produktgruppeID = null; // ID zurücksetzen
  }
}

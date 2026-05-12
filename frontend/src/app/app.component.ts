// Importieren der notwendigen Angular-Module und Komponenten
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';

import { DatenVerwaltungComponent } from './daten-verwaltung/daten-verwaltung.component';
import { BewertungsprozessComponent } from './bewertungsprozess/bewertungsprozess.component';

// Dekorator, der Metadaten für die Komponente bereitstellt
@Component({
  selector: 'app-root', // Der CSS-Selektor für die Komponente, der in der HTML-Datei verwendet wird
  standalone: true, // Gibt an, dass die Komponente eigenständig ist und keine Module benötigt
  imports: [ // Liste der zu importierenden Module und Komponenten
    RouterOutlet, // Ermöglicht das Anzeigen von Komponenten basierend auf der aktuellen Route
    NavigationComponent, // Einbindung der Navigationsleiste
    FooterComponent, // Einbindung des Footers
    DatenVerwaltungComponent, // Komponente zur Verwaltung von Daten
    BewertungsprozessComponent
  ],
  templateUrl: './app.component.html', // Pfad zur HTML-Vorlage der Komponente
  styleUrls: ['./app.component.css'] // Pfad zur CSS-Datei der Komponente
})
export class AppComponent {
  title = 'frontend'; // Titel der Anwendung, kann in der HTML-Vorlage verwendet werden
}

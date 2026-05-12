// Importieren der Angular-Routing-Module und der Komponenten, die für die Routen verwendet werden
import { Routes } from '@angular/router';
import { ProduktgruppeTeileComponent } from './produktgruppe-teile/produktgruppe-teile.component';
import { ProduktversionComponent } from './produktversion/produktversion.component';
import { DatenVerwaltungComponent } from './daten-verwaltung/daten-verwaltung.component';
import {BewertungsprozessComponent} from './bewertungsprozess/bewertungsprozess.component'



// Definieren der Routen für die Anwendung
export const routes: Routes = [
    { path: '', component: DatenVerwaltungComponent }, // Standardroute für die Startseite
    { path: 'produktgruppe-teile', component: ProduktgruppeTeileComponent}, // Route zur Komponente für die Auswahl und Verwaltung von Produktgruppen und Teilen
    { path: 'produktversion', component: ProduktversionComponent,
        children: [
            { path: 'bewertungsprozess', component: BewertungsprozessComponent }
        ]
    }, // Route zur Komponente für die Verwaltung der Produktversionen
    { path: 'daten-verwaltung', component: DatenVerwaltungComponent}, // Route zur Komponente für die Datenverwaltung
    {path:  'bewertungsprozess', component: BewertungsprozessComponent}
];

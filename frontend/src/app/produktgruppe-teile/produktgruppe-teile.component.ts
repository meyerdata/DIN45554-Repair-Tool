import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produktgruppe-teile', // Definiert den CSS-Selector für die Komponente
  standalone: true, // Gibt an, dass die Komponente eigenständig ist
  imports: [FormsModule, CommonModule], // Importiert benötigte Angular-Module
  templateUrl: './produktgruppe-teile.component.html', // Verweist auf das HTML-Template
  styleUrls: ['./produktgruppe-teile.component.css'] // Verweist auf die CSS-Dateien
})
export class ProduktgruppeTeileComponent implements OnInit {
  produktgruppen: any[] = []; // Liste aller verfügbaren Produktgruppen
  selectedProduktgruppe: any = ''; // Aktuell ausgewählte Produktgruppe
  teile: any[] = []; // Liste der Teile für die ausgewählte Produktgruppe
  selectedTeile: any[] = []; // Liste der ausgewählten Teile
  productCriteria: any[] = []; // Liste der Kriterien für das Produkt
  showWeightingTable = false; // Steuerung der Sichtbarkeit der Gewichtungstabelle
  weightError = false; // Flag zur Fehlererkennung bei der Gewichtung. Die Summen muss 1 sein
  productCriteriaWeightError: boolean = false; // Fehler bei der Gewichtungsfaktoren der Produktkriterien. Die Summe muss 1 sein
  partsCriteriaWeightErrors: boolean[] = []; // Fehler bei der Gewichtungsfaktoren der Kriterien der einzelnen Teile
  // criteriaOptions = [ // Liste der verfügbaren Kriterienoptionen DEUTSCH
  //   { value: 'Demontagetiefe', text: 'Disassembly Depth' },
  //   { value: 'Befestigungselemente', text: 'Fasteners and Connectors' },
  //   { value: 'Werkzeuge', text: 'Tools' },
  //   { value: 'Verfügbarkeit von Ersatzteile', text: 'Availability of Spare Parts' },
  //   { value: 'Verfügbarkeitsdauer von Ersatzteile', text: 'Availability Duration of Spare Parts' },
  //   { value: 'Verfügbarkeiten von Informationen', text: 'Availability of Information' },
  //   { value: 'Arbeitsumbegung', text: 'Working environment' },
  //   { value: 'Diegnose-Sopport und Schnittstelle', text: ' Diagnostic support and interfaces ' },
  //   { value: 'Datenmanagement', text: 'Data Management' },
  //   { value: 'eigene', text: '-- Own criterion --' }
  // ];
  criteriaOptions = [ // Liste der verfügbaren Kriterienoptionen
    { value: 'Disassembly Depth', text: 'Disassembly Depth' },
    { value: 'Fasteners and Connectors', text: 'Fasteners and Connectors' },
    { value: 'Tools', text: 'Tools' },
    { value: 'Availability of Spare Parts', text: 'Availability of Spare Parts' },
    { value: 'Availability Duration of Spare Parts', text: 'Availability Duration of Spare Parts' },
    { value: 'Availability of Information', text: 'Availability of Information' },
    { value: 'Working environment', text: 'Working environment' },
    { value: 'Diagnostic support and interfaces', text: 'Diagnostic support and interfaces' },
    { value: 'Data Management', text: 'Data Management' },
    { value: 'Skill level', text: 'Skill level'},
    {value: 'Return options', text: 'Return options'},
    { value: 'eigene', text: '-- Own criterion --' }
  ];
  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    // Produktgruppen aus der Datenbank laden
    this.dataService.getProduktgruppen().subscribe({
      next: (data) => {
        this.produktgruppen = data; // Speichert die Produktgruppen in der Komponente
      },
      error: (error) => {
        console.error('Error lpading product groups:', error);
      }
    });
  }

  // Erweiterung des Textbereichs
  expandTextarea(event: any): void {
    event.target.classList.add('expanded');
  }
  
  // Verkleinerung des Textbereichs
  shrinkTextarea(event: any): void {
    event.target.classList.remove('expanded');
  }

  // Ändern der ausgewählten Produktgruppe und Laden der entsprechenden Teile
  onProduktgruppeChange(): void {
    if (!this.selectedProduktgruppe) {
      console.error('No product group selected');
      return;
    }
  
    this.dataService.getTeileForProduktgruppe(this.selectedProduktgruppe).subscribe({
      next: (response) => {
        // Zu den Teilen jedes Teils eine 'selected' Eigenschaft hinzufügen
        this.teile = (response.teile || response).map((teil: any) => ({
          ...teil,
          selected: false
        }));
      },
      error: (error) => {
        console.error('Error loading parts:', error);
      }
    });
  }

  // Auswahl der Teile finalisieren
  finalizeParts(): void {
    this.selectedTeile = this.teile.filter(teil => teil.selected); // Filtert die ausgewählten Teile
    
    if (this.selectedTeile.length === 0) {
      alert('Please select at least one part.');
      return;
    }

    // Initialisiere alle Teileigenschaften
    this.selectedTeile.forEach(teil => {
      teil.criteria = []; // Initialisiert die Kriterienliste des Teils
      teil.weight = 0; // Setzt das Gewicht des Teils zurück
      teil.description = ''; // Setzt die Beschreibung des Teils zurück
    });

    this.productCriteria = []; // Setzt die Produktkriterien zurück

    this.showWeightingTable = true; // Gewichtungstabelle anzeigen
    this.onWeightChange(); // Initiale Gewichtskontrolle

    console.log('Final Parts:', this.selectedTeile);
  }

  // Gewichtskontrolle: Summe der Gewichte darf nicht größer als 1 sein
  onWeightChange(): void {
    // Überprüfen Sie die Gewichtung der Teile
    const totalWeight = this.selectedTeile.reduce((sum: number, teil: any) => sum + (teil.weight || 0), 0);
    this.weightError = totalWeight !== 1; // Setzt den Fehlerstatus basierend auf der Gewichtssumme

    // Überprüfen Sie die Gewichtungsfaktoren der Produktkriterien
    const totalProductCriteriaWeight = this.productCriteria.reduce((sum: number, criterion: any) => sum + (criterion.weighting || 0), 0);
    this.productCriteriaWeightError = totalProductCriteriaWeight !== 1;
    
    // Überprüfen Sie die Gewichtungsfaktoren der Kriterien für jedes Teil
    this.partsCriteriaWeightErrors = this.selectedTeile.map(teil => {
        const totalCriterionWeight = teil.criteria.reduce((sum: number, criterion: any) => sum + (criterion.weighting || 0), 0);
        return totalCriterionWeight !== 1;
    });
  }

  // Entfernen eines Teils aus der Auswahl
  removeTeil(index: number): void {
    this.selectedTeile.splice(index, 1); // Entfernt das Teil aus der Auswahl
    this.onWeightChange(); // Überprüft erneut die Gewichtskontrolle
  }

  // Kriterium hinzufügen
  addCriterion(teil: any): void {
    teil.criteria.push({ criterion: '', weighting: null, description: '', isCustom: false, klassifizierung: null }); // Fügt ein neues Kriterium zur Liste des Teils hinzu
  }

  // Kriterium entfernen
  removeCriterion(teil: any, index: number): void {
    teil.criteria.splice(index, 1); // Entfernt das Kriterium aus der Liste des Teils
  }

  // Änderung des Kriteriums
  onCriterionChange(criterion: any): void {
    if (criterion.criterion === 'eigene') { // Prüft, ob ein benutzerdefiniertes Kriterium ausgewählt wurde
      criterion.isCustom = true;
      criterion.criterion = ''; // Leert das Kriteriumsfeld für eigene Kriterien
    } else {
      criterion.isCustom = false;
    }
  }

  // Produktkriterium hinzufügen
  addProductCriterion(): void {
    this.productCriteria.push({ criterion: '', weighting: null, description: '',klassifizierung:null ,isCustom: false });
  }

  // Produktkriterium entfernen
  removeProductCriterion(index: number): void {
    this.productCriteria.splice(index, 1); // Entfernt das Produktkriterium aus der Liste
  }

  // Änderung des Produktkriteriums
  onProductCriterionChange(criterion: any): void {
    if (criterion.criterion === 'eigene') { // Prüft, ob ein benutzerdefiniertes Produktkriterium ausgewählt wurde
      criterion.isCustom = true;
      criterion.criterion = ''; // Leert das Kriteriumsfeld für eigene Produktkriterien
    } else {
      criterion.isCustom = false;
    }
  }

  // Die Daten in der Lokale Storage speichern. Für die weitere Bewertungsprozess
  createProductVersion(): void {
    if (!this.weightError && !this.productCriteriaWeightError && !this.partsCriteriaWeightErrors.includes(true)) {
      // Speichere die ausgewählten Teile und die Produktkriterien und navigiere zur Produktversion Komponente
      localStorage.setItem('selectedProductGroup', this.selectedProduktgruppe);
      localStorage.setItem('selectedTeile', JSON.stringify(this.selectedTeile));
      localStorage.setItem('productCriteria', JSON.stringify(this.productCriteria));

      this.router.navigate(['/produktversion']); // Navigiert zur Produktversionskomponente
    } else {
      alert('The sum of the weights for both parts and criteria must be 1.');
    }
  } 
 
}

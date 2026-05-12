import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../data.service'; // Importiert den Service zur Datenverarbeitung
import { Router } from '@angular/router'; // Importiert den Router für Navigation
import { RouterModule } from '@angular/router'; // Importiert das RouterModule für Routing
import { OnInit } from '@angular/core';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-bewertungsprozess',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './bewertungsprozess.component.html',
  styleUrls: ['./bewertungsprozess.component.css'],
})
export class BewertungsprozessComponent implements OnInit{


  constructor(private dataService: DataService, private router: Router) {}
  criteria: string[] = [];
  relevantTeile: any[] = [];
  componentNames: string[] = [];
  produktgruppeId: number = 0;  // ID der ausgewählten Produktgruppe
  produktgruppenName: string = '';

  ngOnInit() {
    this.dataService.getAllgemeineKriterien().subscribe({
      next: (data) => {
        this.criteria = data.map((k: any) => k.name); 

        this.components = this.criteria.map((criterion) => {
           let factorValue = '0';
           let classValue = '0';
          for (const teil of this.relevantTeile) {
            if (Array.isArray(teil.criteria)) {
              console.log( teil.criteria);
              
              const match = teil.criteria.find((c: { criterion: string; weighting: number; klassifizierung: string}) => {
                  const isMatch = c.criterion.toLowerCase() === criterion.toLowerCase();
                  if (isMatch) {
                    console.log('Matched:', c.criterion, 'Criterion:', criterion, 'Weighting:', c.weighting, isMatch);
                    factorValue = (c.weighting * 100).toString(); 
                    classValue = c.klassifizierung || '0'
                  }
                  return isMatch;
                });
            }
          }



        return {
          criterion,
          data: this.componentNames.map(() => ({
            factors: factorValue,
            points: 0,
            class: classValue,
          })),
          product: {
            factors: factorValue,
            points: 0,
            class: '',
          },
        };
      });
            },
            error: (err) => console.error('Fehler beim Laden der allgemeinen Kriterien:', err),
          });
          this.loadBewertungsprozesse();
          
          this.relevantTeile = JSON.parse(localStorage.getItem('selectedTeile') || '[]');
 
    if (this.relevantTeile.length > 0 && this.relevantTeile[0].produktgruppe_id) {
      this.produktgruppeId = this.relevantTeile[0].produktgruppe_id;
    }
    this.loadProduktgruppenName();
    this.componentNames = this.relevantTeile.map(t => t.name);
    // this.componentNames.push(this.produktgruppenName);
  }
    bewertungsprozesse: any[] = [];


  saveBewertungsprozess() {
    // Prepare data for Excel
    const tableData: any[] = [];

    // Header row
    const header = ['Criterion', ...this.componentNames, 'Product'];
    tableData.push(header);

    // Table rows
    this.components.forEach(row => {
      const rowData = [
        row.criterion,
        ...row.data.map((comp: any) => `Factors: ${comp.factors}, Points: ${comp.points}, Class: ${comp.class}`),
        `Factors: ${row.product.factors}, Points: ${row.product.points}, Class: ${row.product.class}`
      ];
      tableData.push(rowData);
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bewertungsprozess');

    // Download Excel file
    XLSX.writeFile(workbook, 'Bewertungsprozess.xlsx');
  }




  loadProduktgruppenName(): void {
    this.dataService.getProduktgruppeById(this.produktgruppeId).subscribe({
      next: (data: any) => {
        this.produktgruppenName = data.name;  // Setze den Namen der Produktgruppe
        console.log('Produktgruppenname:', this.produktgruppenName);
        this.componentNames.push(this.produktgruppenName); 
      },
      error: (error) => {
        console.error('Fehler beim Laden der Produktgruppe:', error);
      }
    });}


  loadBewertungsprozesse() {
    this.dataService.getAllBewertungsprozesse().subscribe({
      next: (bewertungen) => console.log('Bewertungen:', bewertungen),
      error: (err) => console.error('Fehler beim Abrufen:', err),
    });
  }


 // Liste aller relevanten Spalten (ohne 'General')
 assessmentColumns = [...this.componentNames, 'Product'];


  // Daten für die Tabelle
  components = this.criteria.map((criterion) => ({
    criterion,
    data: this.componentNames.map(() => ({
      factors: '',
      points: 0,
      class: '',
    })),
    product: {
      factors: '',
      points: 0,
      class: '',
    },
  }));


  

  // General-Werte
  generalValues: string[] = this.criteria.map(() => '0');

  // Punkte-Mapping
  classPointsMapping: Record<string, Record<string, number>> = {
    'Disassembly Depth': { A: 9, B: 7, C: 5, D: 0 },
    'Fasteners and Connectors': { A: 9, B: 5, C: 0 },
    'Tools': { A: 9, B: 8, C: 6, D: 5, E: 0 },
    'Availability of spare parts': { A: 9, B: 8, C: 7, D: 6, E: 0 },
    'Classification of spare parts availability by duration of availability': { A: 9, B: 7, C: 3, D: 0},
    'Classification of spare part interfaces': {A: 9, B: 7, C: 1},
    'Types and availability of information': {A: 9, B: 4, C:1},
    'Diagnostic Support and interfaces': {A: 9, B: 8, C: 6, D: 5, E: 0},
    'Working environment': {A: 9, B: 7, C: 0},
    'Datamanagement': {A: 9 , B: 7, C: 0},
    'Skill level': {A: 9 , B: 8, C: 7, D: 5, E: 0},
    'Password and factory reset for reuse': {A: 9, B: 7, C: 5, D: 0},
    'Availability of old appliances + identification in operating environment': {A: 9, B: 7, C: 0},
  };

  // Geschützte Zeilen
  protectedRows = ['Sum of Factors always 100 %!', 'Result', 'Factor Final Assessment', 'Final Assessment'];

  // Sichtbare Komponenten
  get visibleComponents() {
    return this.components;
  }

  explanations = [

    {
      criterion: 'Availability of old appliances + Identification in operating environment ',
      points: { A: 9, B: 7, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 },
      description: 'A: Database for finding specific old appliances, B: Clearly recognisable by (customer) label when installed/ clearly recognisable via electrical interface, C: Identification is no longer possible'
    },
    {
      criterion: 'Working environment',
      points: { A: 9, B: 5, C: 1, D: 0, E: 0, F: 0, G: 0, H: 0 },
      description: 'A: Use environment, B: Workshop environment, C: Production-equivalent environment'
    },
    {
      criterion: 'Fasteners and Connectors',
      points: { A: 9, B: 5, C: 0, D: 0, E: 0, F: 0, G:0, H: 0 },
      description: 'A: Reusable , B: Removable , C: Neither reusable nor removable '
    },
    {
      criterion: 'Datamanagement',
      points: { A: 9, B: 7, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 },
      description: 'A:Built-in or no data stored (The product does not save data or has integrated tools for secure deleting) , B: On request (Secure data deletion or transfer is available on request, e.g. through external software or services) , C: Not available (There is no way to securely delete or transfer data)'
    },
    {
      criterion: 'Disassembly Depth',
      points: { A: 9, B: 7, C: 5, D: 0, E: 0, F: 0, G: 0, H: 0 },
      description: 'A: DT = 1 , B: DT = 2 , C: DT = 3 = Referenz, D: DT > Referenz'
    },
    {
      criterion: 'Diagnostic Support and interfaces',
      points: { A: 9, B: 8, C: 6, D: 5, E: 0, F: 0, G: 0, H: 0},
      description: 'A: Intuitive interface , B: Expert , C: Manufacturer or authorized expert, D: Not feasible with any existing skill'
    },
    {
      criterion: 'Classification of spare part interfaces',
      points: { A: 9, B: 7, C: 1, D: 0, E: 0, F: 0, G: 0, H: 0 },
      description: 'A: Standard part with standard interface, B: Proprietary part with standard interface , C: Proprietary part with non-standard interface'
    },
    {
      criterion: 'Availability of spare parts',
      points: { A: 9, B: 8, C: 7, D: 6, E: 0, F: 0, G: 0, H: 0 },
      description: 'A: Publicly available , B: Available to independent repair service providers , C: Available to manufacturer-authorized repair service providers, D: Available to the manufacturer only, E: No spare parts available'
    },
    {
      criterion: 'Types and availability of information',
      points: { A: 9, B: 4, C: 1, D: 0, E: 0, F: 0, G: 0, H: 0 },
      description: 'A: Comprehensive information available (Detailed and complete repair instructions, including wiring diagrams, diagnostic software and parts lists) , B: Basic information available (Sufficient information for basic repairs, but may not be complete) , C: No information available'
    },
    {
      criterion: 'Classification of spare parts availability by duration of availability',
      points: { A: 9, B: 7, C: 3, D: 0, E: 0, F: 0, G: 0, H: 0 },
      description: 'A:  Long-term availability (Spare parts are available for a period that covers the expected service life of the product) , B:  Mid-term availabiltiy (Spare parts are available for a period that covers the average service life of the product) , C: Short-term availabiltiy (Spare parts are available for a short period of time, e.g. two years after the product is sold) , D: No information on duration of availability '
    },
    {
      criterion: 'Tools',
      points: { A: 9, B: 8, C: 6, D: 5, E: 0, F: 0, G: 0, H: 0 },
      description: 'A: Feasible with: - the use of no tool,or - a tool or set of tools that is supplied with the product or spare part, or - basic tools as listed in Table A.3, B: Feasible with product group specific tools , C: Feasible with other commercially available tools, D: Feasible with proprietary tools, E: Not feasible with any existing tool'
    },
    {
      criterion: 'Password and factory reset for reuse',
      points: { A: 9, B: 7, C: 5, D: 0, E: 0, F: 0, G: 0, H: 0 },
      description: 'A: Integrated reset, B: External reset , C: Service reset, D: No reset'
    },
    {
      criterion: 'Classification of information availability by targer groups',
      points: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 },
      description: 'A: Publicly available, B: Available to independent repair service providers , C: Available to manufacturer-authorized repair service providers, D: Available to the manufacturer only'
    },
    {
      criterion: 'Return options',
      points: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0},
      description: 'A: Comprehensive return options, B: Basic return options , C: No return options'
    },

  ];



  isProtectedRow(criterion: string): boolean {
    return this.protectedRows.includes(criterion);
  }

 

  updatePoints(rowIndex: number, componentIndex: number): void {
    const row = this.components[rowIndex];
    const component = row.data[componentIndex];
  
    // Punktelogik wie zuvor...
    if (row.criterion === 'Disassembly Depth') {
      const numericClass = parseInt(component.class, 10);
      if (!isNaN(numericClass) && numericClass >= 1 && numericClass <= 10) {
        component.points = numericClass;
      } else {
        component.points = 0;
        alert('Bitte geben Sie eine Zahl zwischen 1 und 10 für "Disassembly Depth" ein.');
      }
    } else {
      const classMapping = this.classPointsMapping[row.criterion];
      if (classMapping && component.class in classMapping) {
        component.points = classMapping[component.class];
      } else {
        component.points = 0;
      }
    }
  
    // Aktualisiere die Produktspalte separat
    this.updateProductColumn(rowIndex);
  
    // Final Assessment aktualisieren
    this.calculateFinalAssessment();
  }
  
  
// Methode zum Aktualisieren der Produktspalte
updateProductColumn(rowIndex: number): void {
  const row = this.components[rowIndex];
  
  if (row.criterion === 'Disassembly Depth') {
    // Spezielle Logik für "Disassembly Depth"
    const numericClass = parseInt(row.product.class, 10);
    if (!isNaN(numericClass) && numericClass >= 1 && numericClass <= 10) {
      row.product.points = numericClass; // Punkte direkt aus der Zahl übernehmen
    } else {
      row.product.points = 0; // Standardwert bei ungültiger Eingabe
      alert('Bitte geben Sie eine Zahl zwischen 1 und 10 für die Produktspalte von "Disassembly Depth" ein.');
    }
  } else {
    // Standardlogik für andere Kriterien
    const productClassMapping = this.classPointsMapping[row.criterion];
    if (productClassMapping && row.product.class in productClassMapping) {
      row.product.points = productClassMapping[row.product.class];
    } else {
      row.product.points = 0; // Fallback-Wert, falls keine Zuordnung vorhanden ist
    }
  }
}


  updateProductPoints(index: number): void {
    // Beispiel: Aktualisiere die Punkte basierend auf der Eingabe in der Product-Class
    const productClass = this.visibleComponents[index].product.class;
    const productRow = this.components[index];

    const classMapping = this.classPointsMapping[productRow.criterion];
    // Optional: Führe Logik basierend auf der Product-Class aus
    if (classMapping && productClass in classMapping) {
      productRow.product.points = classMapping[productClass];
      } else {
        productRow.product.points = 0;
      }
      console.log('Product points updated for row ${index}:', productRow.product.points);
    }
  
  // Beispielaufruf beim Bearbeiten der Produktspalte
onProductClassChange(index: number): void {
  // Aktualisieren Sie die Produktspalte, wenn eine neue Klasse in der Produktspalte ausgewählt wird
  this.updateProductColumn(index);
}
//Punkte-Mapping für Produkt-Spaltn aktualisieren
  updateClassPointsMapping(criterion: string, classKey: string, value: number): void {
   // Aktualisiere die Punktwerte in der Erklärung
   if (!this.classPointsMapping[criterion]) {
    this.classPointsMapping[criterion] = {};
  }

  // Setze den neuen Punktwert
  this.classPointsMapping[criterion][classKey] = value;

  // Suche nach der betroffenen Komponente in der Tabelle und aktualisiere ihre Punktwerte
  this.components.forEach((component, i) => {
    if (component.criterion === criterion) {
      // Aktualisiere alle Komponenten, deren Klasse mit der geänderten übereinstimmt
      component.data.forEach((comp, j) => {
        if (comp.class === classKey) {
          // Setze den Punktwert basierend auf dem geänderten Wert
          this.updatePoints(i, j); // Die Methode updatePoints sorgt dafür, dass die Punkte aktualisiert werden
        }
      });

      // Auch die Produktspalte für das entsprechende Kriterium muss aktualisiert werden
      if (component.product.class === classKey) {
        this.updateProductColumn(i); // Aktualisiert die Produktspalte
      }
    }
  });
}
// Factors manuell bearbeitet
private manuallyEditedFactors: Record<string, boolean> = {};

// Beim Bearbeiten eines Factors wird dieser als manuell geändert markiert
onFactorEdit(rowIndex: number, componentIndex: number): void {
  const key = `${rowIndex}-${componentIndex}`;
  this.manuallyEditedFactors[key] = true;

  // Überprüfen, ob die Factors korrekt summiert sind
  this.checkFactorsSum(rowIndex);

  // Final Assessment neu berechnen
  this.calculateFinalAssessment();
}

//Überprüfung der Factors-Summe (auf 100 Prozent)
checkFactorsSum(rowIndex: number): void {
  const row = this.components[rowIndex];
  let totalFactors = 0;

  // Berechne die Summe der Factors für alle Komponenten in der Zeile
  row.data.forEach((comp) => {
    const factorValue = parseFloat(comp.factors.replace('%', '').trim());
    if (!isNaN(factorValue)) {
      totalFactors += factorValue;
    }
  });

  // Überprüfen, ob die Summe 100% ergibt
  // if (totalFactors !== 100) {
  //   alert(`Die Summe der Factors in Zeile "${row.criterion}" muss 100% ergeben. Aktuelle Summe: ${totalFactors}%`);
  // }
}
// General-Wert aktualisieren und Factors synchronisieren, sofern nicht manuell bearbeitet
updateGeneral(index: number): void {
  let generalValue = this.generalValues[index];
  generalValue = generalValue.replace('%', '').trim();
  const numericGeneral = parseFloat(generalValue);

  if (!this.generalValues[index]) {
    this.generalValues[index] = '0';
  }

  this.checkGeneralSumAfterLastChange(index);

  if (!isNaN(numericGeneral) && numericGeneral >= 0 && numericGeneral <= 100) {
    this.generalValues[index] = `${numericGeneral}%`;

    this.components[index].data.forEach((comp, compIndex) => {
      const key = `${index}-${compIndex}`;
      if (!this.manuallyEditedFactors[key]) {
        comp.factors = `${numericGeneral}%`;
      }
    });

    // Synchronisiere die Produktspalte
    const key = `${index}-product`;
    if (!this.manuallyEditedFactors[key]) {
      this.components[index].product.factors = `${numericGeneral}%`;
    }

    // Final Assessment neu berechnen
    this.calculateFinalAssessment();
  } else {
    alert('Bitte geben Sie einen gültigen Prozentwert zwischen 0 und 100 ein.');
  }
}



// Prüfen, ob die Summe der General-Werte 100% ergibt (nur nach der letzten Eingabe)
checkGeneralSumAfterLastChange(index: number): void {
  // Überprüfe, ob es die letzte Zeile ist
  if (index === this.generalValues.length - 1) {
    const total = this.generalValues.reduce((sum, value) => {
      const numericValue = parseFloat(value);
      return !isNaN(numericValue) ? sum + numericValue : sum;
    }, 0);

    if (total !== 100) {
      alert('Die Summe der Prozentwerte muss 100% ergeben. Bitte passen Sie die Werte an.');
    }
  }
}




//---- Datenstruktur für die Berechnungstabelle ----
 // Allgemeine Bewertung
//  resultValues: any = {
//   general: '',
//   'Component 1': '',
//   'Component 2': '',
//   product: '',
// };


// Methode zum Berechnen des Result
updateResult(): void {
  // Setze alle Zwischensummen zurück
  let totalProductResult = 0;
  const totalComponentResults: number[] = [];  // Dynamisches Array für alle Componenten

  this.components.forEach((row) => {
    // Initialisiere das Array für diese Reihe mit 0 für jede Component
    const componentResults: number[] = new Array(row.data.length).fill(0);  // Dynamische Anzahl von Componenten

    // Berechnung für jede Component-Spalte (Komponenten 1, 2, ..., n)
    row.data.forEach((comp, index) => {
      const factorValue = parseFloat(comp.factors.replace('%', '').trim());  // Prozentwert als Zahl
      if (!isNaN(factorValue)) {
        const componentCalc = (factorValue / 100) * comp.points;
        componentResults[index] += componentCalc;
      }
    });

    // Berechnung für Product (separat)
    const productFactorValue = parseFloat(row.product.factors.replace('%', '').trim());
    let productResult = 0;
    if (!isNaN(productFactorValue)) {
      productResult = (productFactorValue / 100) * row.product.points;
    }

    // Ergebnisse für diese Reihe zu den Gesamtergebnissen addieren
    componentResults.forEach((componentResult, index) => {
      if (!totalComponentResults[index]) {
        totalComponentResults[index] = 0;
      }
      totalComponentResults[index] += componentResult;
    });

    totalProductResult += productResult;

    console.log(`Berechnung für row: ${JSON.stringify(row)}\nComponenten: ${JSON.stringify(componentResults)}, Product: ${productResult}`);
  }); 

  // Ergebnisse in resultValues speichern
  console.log(`Endgültige Ergebnisse - Components: ${JSON.stringify(totalComponentResults)}, Product: ${totalProductResult.toFixed(2)}`);

  // Speichern der Ergebnisse für alle Components
  totalComponentResults.forEach((result, index) => {
    this.resultValues[`Component ${index + 1}`] = result.toFixed(2);
  });

  // Speichern der Ergebnisse für Product
  this.resultValues.product = totalProductResult.toFixed(2);

}


// Initialisiere die Werte für Factor Final Assessment
// factorFinalAssessmentValues: { [key: string]: number } = {};
// finalAssessment: { [key: string]: number } = {}; // Hinzufügen eines Objekts für die Ergebnisse
 finalAssessmentValue: number = 0;
// finalAssessmentResult: number = 0;
resultValues: any = {
  'Component 1': 0,
  'Component 2': 0,
  product:0,
};  // Hier die Resultat-Werte speichern
factorFinalAssessmentValues: any = {
  'Component 1':0,
  'Component 2':0,
  product:0,
};  // Hier die Bewertungs-Faktoren speichern
finalAssessmentResult: string = '';  // Endergebnis für die Anzeige
  // Beispiel für die Werte, die in der finalAssessment gespeichert werden
  finalAssessment: { [key: string]: number } = {
    general: 0,
  };

  updateFinalAssessment() {
    console.log('Factor Final Assessment Values:', this.factorFinalAssessmentValues);
    this.finalAssessmentValue = this.calculateFinalAssessment();
  }
  
// Funktion zur Berechnung des finalen Ergebnisses
calculateFinalAssessment(): number {
  let total = 0;
  let count = 0;

  // Berechnungen durchlaufen
  this.componentNames.forEach(componentName => {
    if (!(componentName in this.resultValues)) {
      console.error(`Fehlender Wert in resultValues für ${componentName}`);
    }
    if (!(componentName in this.factorFinalAssessmentValues)) {
      console.error(`Fehlender Wert in factorFinalAssessmentValues für ${componentName}`);
    }
  
    const resultValue = this.resultValues[componentName] || 0;
    const factorValue = this.factorFinalAssessmentValues[componentName]|| 0;
    
    console.log(`Werte für ${componentName}: Result=${resultValue}, Factor=${factorValue}`);  // Debugging

    // Überprüfen, ob Werte gültig sind
    if (resultValue != null && factorValue != null && !isNaN(resultValue) && !isNaN(factorValue)) {
      total += resultValue * factorValue;
      count++;
    } else {
      console.warn(`Ungültige Werte für ${componentName}: ResultValue=${resultValue}, FactorValue=${factorValue}`);
    }
  });

  // Produkt-Werte ebenfalls prüfen
  const productValue = this.resultValues['product'];
  const productFactor = this.factorFinalAssessmentValues['product'];

  console.log(`Werte für Produkt: Result=${productValue}, Factor=${productFactor}`);  // Debugging

  if (productValue != null && productFactor != null && !isNaN(productValue) && !isNaN(productFactor)) {
    total += productValue * productFactor;
    count++;
  } else {
    console.warn(`Ungültige Werte für Produkt: ResultValue=${productValue}, FactorValue=${productFactor}`);
  }

  // Endgültige Berechnung
  if (count > 0) {
    const finalAssessment = total;
    console.log('Berechnetes Final Assessment:', finalAssessment);  // Debugging
    return finalAssessment;
  } else {
    console.warn('Keine gültigen Werte für Final Assessment');
    return 0;  // Rückgabe eines sicheren Standardwertes
  }
}


// Call this function, whenever a change occurs
onInputChange() {
  console.log('Aktuelle Factor Final Assessment Values:', this.factorFinalAssessmentValues);
  console.log('Result Values:', this.resultValues);

  this.finalAssessmentValue = this.calculateFinalAssessment();
}



// Methode zum Hinzufügen einer neuen Komponente
   addComponent(): void {
    const newComponentName = 'Component ${this.componentNames.length + 1}';
    this.componentNames.push(newComponentName);

    // Neue Daten für die erste Tabelle
    this.components.forEach((component) => {
      component.data.push({
        factors: '',
        points: 0,
        class: '',
      });
    });
  }
}
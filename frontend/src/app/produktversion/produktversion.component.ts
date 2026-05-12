import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';  // Dein Service zum Abrufen der Daten
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-produktversion',  // Der Selector, um die Komponente in HTML einzubinden
  standalone: true,  // Bedeutet, dass diese Komponente alleine verwendet werden kann
  imports: [FormsModule, CommonModule, RouterModule],  // Module, die in dieser Komponente verwendet werden
  templateUrl: './produktversion.component.html',  // Pfad zur HTML-Vorlage
  styleUrls: ['./produktversion.component.css']  // Pfad zur CSS-Datei
})
export class ProduktversionComponent implements OnInit {
  produktversionen: any[] = [];  // Liste der Produktversionen aus der Datenbank
  selectedProduktversionen: any[] = [];  // Vom Benutzer ausgewählte Produktversionen
  produktgruppeId: number = 0;  // ID der ausgewählten Produktgruppe
  produktgruppenName: string = '';  // Name der ausgewählten Produktgruppe
  allgemeineKriterien: any[] = []; // Alle allgemeinen Kriterien
  produktKriterien: any[] = [];  // Kriterien für die Produktgruppe
 relevantTeile: any[] = [];  // Teile und deren Kriterien

  anzeigenTabellen: boolean = false;  // Steuert das Anzeigen der Tabellen
  kennzahlenBerechnet: boolean = false;  // Gibt an, ob Kennzahlen berechnet wurden
  endbewertungAnzeigen: boolean = false;  // Steuert das Anzeigen der Endbewertung
  vergleichsErgebnisseAnzeigen: boolean = false;  // Steuert das Anzeigen der Vergleichsergebnisse
  vollstaendigeTabelleAnzeigen: boolean = false;  // Steuert das Anzeigen der vollständigen Tabelle
  vergleichsErgebnisse: any[] = [];  // Ergebnisse des Vergleichs der Produktversionen

  showKennzahlenBerechnenButton: boolean = false;  // Zeigt den Button zum Berechnen der Kennzahlen
  showEndbewertungButton: boolean = false;  // Zeigt den Button zur Endbewertung
  showVersionenVergleichenButton: boolean = false;  // Zeigt den Button zum Vergleichen der Versionen
  

  constructor(private dataService: DataService) {}  // Der DataService wird injiziert

  ngOnInit(): void {
    // Ausgewählte Produktgruppe aus dem localStorage abrufen
    const storedProduktgruppeId = localStorage.getItem('selectedProductGroup');
    
    // Überprüfen, ob der Wert null ist, und in eine Zahl umwandeln
    this.produktgruppeId = storedProduktgruppeId !== null ? +storedProduktgruppeId : 0; 
    
    if (this.produktgruppeId !== 0) {
      // Lade die Produktversionen für die ausgewählte Produktgruppe
      this.loadProduktversionen();
      // Lade den Namen der ausgewählten Produktgruppe
      this.loadProduktgruppenName(); 
    } else {
      console.error('No product group found in localStorage');
    }
    this.loadAllgemeineKriterien();

    // Falls du relevante Teile und Kriterien ebenfalls laden musst
    this.relevantTeile = JSON.parse(localStorage.getItem('selectedTeile') || '[]');
    this.produktKriterien = JSON.parse(localStorage.getItem('productCriteria') || '[]'); 
  }

  // Methode zum Laden des Produktgruppennamens
  loadProduktgruppenName(): void {
    this.dataService.getProduktgruppeById(this.produktgruppeId).subscribe({
      next: (data: any) => {
        this.produktgruppenName = data.name;  // Setze den Namen der Produktgruppe
        // console.log('Produktgruppenname:', this.produktgruppenName);
      },
      error: (error) => {
        console.error('Error Laoding Product Group:', error);
      }
    });
  }
  
  // Neue Methode zum Laden der Produktversionen aus der Datenbank
  loadProduktversionen(): void {
    this.dataService.getVersionenByProduktgruppe(this.produktgruppeId).subscribe({
      next: (data: any[]) => {
        this.produktversionen = data.map(version => ({
          ...version,
          versionName: version.name || version.versionName  // Sicherstellen, dass der Name korrekt gesetzt ist
        }));
      },
      error: (error: any) => {
        console.error('Error loading Product VersionsFehler beim Laden der Produktversionen:', error);
      }
    });
  }

  // Methode zum Laden aller allgemeinen Kriterien
  loadAllgemeineKriterien(): void {
    this.dataService.getAllgemeineKriterien().subscribe({
      next: (data) => {
        this.allgemeineKriterien = data;
        localStorage.setItem('allgemeineKriterien', JSON.stringify(data));
        // console.log('Allgemeine Kriterien geladen und gespeichert.');
      },
      error: (error) => {
        console.error('Error Loading general criteria:', error);
        alert('Fehler beim Laden der allgemeinen Kriterien.');
      }
    });
  }
  saveAllKriterien(): void {
  this.savegewichtderProduktKomponenten();
  this.saveProduktKriterien();
  this.saveTeileKriterien();
  // Update localStorage for bewertungsprozess
  localStorage.setItem('selectedTeile', JSON.stringify(this.relevantTeile));
  localStorage.setItem('productCriteria', JSON.stringify(this.produktKriterien));
  console.log("SAVED KRITERIEN:", this.selectedProduktversionen, this.relevantTeile );
}
  // Hilfsfunktion zum Normalisieren von Strings 
  normalizeString(str: string): string {
    return str;
  }


  // Methode zum Speichern der Gewichtung der Produktkomponenten
  savegewichtderProduktKomponenten(): void {
    // console.log('Saving gewichtderProduktKomponenten:', this.relevantTeile);
    
    // console.log('produktgruppeId:',this.produktgruppeId);
    if (!this.produktgruppeId || !this.relevantTeile || this.relevantTeile.length === 0) {
      alert('Product Group ID or relvevant parts are missing.');
      return;
    }
    this.selectedProduktversionen.forEach(version=>{
      version.teile.forEach((teil:any, teilIndex:number)=>{
               
        const payload={
          teil_id : teil.teil_id,
          gewichtsfaktor : teil.weight,
          beschreibung  : teil.description
        }
        this.dataService.saveGewichtderProduktKomponente(payload).subscribe({
          next:() =>{
            console.log('GewichtderProduktKomponente  erfolgreich gespeichert:', payload);
            
          },
      error: (error) => {         
        console.error('Fehler beim Speichern eines Produktkriteriums:', error);
        alert('Error Saving Product Criteria. Please try again.');
      }
        })
      })
    })

  }

    
    
  // Methode zum Speichern der Produktkriterien
  saveProduktKriterien(): void {
    // console.log('Saving Produktkriterien:', this.produktKriterien);
    // console.log('teile:',this.relevantTeile);
    
    
    
  if (!this.allgemeineKriterien.length) {
    const stored = localStorage.getItem('allgemeineKriterien');
    if (stored) {
      this.allgemeineKriterien = JSON.parse(stored);
    } else {
      alert('Did not load general criteria.');
      return;
    }
  }

  if (!this.produktgruppeId || !this.produktKriterien || this.produktKriterien.length === 0) {
    alert('Product Group ID or Product Criteria are missing.');
    return;
  }

  this.produktKriterien.forEach(kriterium => {
  const kriteriumName = this.normalizeString((kriterium.criterion || ''));

    const matchedCriterion = this.allgemeineKriterien.find(c =>
      this.normalizeString((c.name || '')) === kriteriumName
    );

    if (!matchedCriterion) {
      console.error(`Criterion with name "${kriterium.criterion}" not found.`);
      // alert(`Kriterium "${kriterium.criterion}" nicht gefunden.`);
      return;
    }

    const payload = {
      kennzahlwert: kriterium.klassifizierung,
      beschreibung: kriterium.description,
      allgemeines_kriterium_id: matchedCriterion.allgemeines_kriterium_id,
      gewichtsfaktor: kriterium.weighting,
      produktgruppe_id: this.produktgruppeId
    };

    this.dataService.saveProduktKriterium(payload).subscribe({
      next: () => {
        console.log('Produktkriterium erfolgreich gespeichert:', payload);
      },
      error: (error) => {
        console.log(matchedCriterion.id);
        
        console.error('Error Saving Product Criterion:', error);
        alert('Error Saving Product Criteria. Please try again.');
      }
      
    });
  });
            
  }

  // Methode zum Speichern der Teilekriterien
  saveTeileKriterien(): void {
  // console.log('Selected Product versions:', this.selectedProduktversionen);

  if (!this.allgemeineKriterien.length) {
    const stored = localStorage.getItem('allgemeineKriterien');
    if (stored) {
      this.allgemeineKriterien = JSON.parse(stored);
    } else {
      alert('Allgemeine Kriterien sind nicht geladen.');
      return;
    }
  }

  if (!this.relevantTeile || this.relevantTeile.length === 0) {
    alert('Keine relevanten Teile vorhanden.');
    return;
  }

  // Aktualisiere this.relevantTeile mit User-Eingaben aus der UI
  this.selectedProduktversionen.forEach(version => {
    version.teile.forEach((teil: any, teilIndex: number) => {
      // console.log('Processing Teil:', teil);
      
      teil.criteria.forEach((teilkriterium: any, critIndex: number) => {
        // Push User-Eingaben zurück in relevantTeile
        const matchingTeil = this.relevantTeile.find(t => t.teil_id === teil.teil_id);
        if (matchingTeil && matchingTeil.criteria && matchingTeil.criteria[critIndex]) {
          matchingTeil.criteria[critIndex].klassifizierung = teilkriterium.klassifizierung ?? 0;
          matchingTeil.criteria[critIndex].description = teilkriterium.description ?? '';
        }

        // console.log('Kriterium:', teilkriterium.criterion, 'Klassifizierung:', teilkriterium.klassifizierung);

        const criteriumName = this.normalizeString((teilkriterium.criterion || ''));
        const matchedCriterion = this.allgemeineKriterien.find(c =>
          this.normalizeString((c.name || '')) === criteriumName
        );

        if (!matchedCriterion) {
          console.error(`Kriterium mit Name "${teilkriterium.criterion}" nicht gefunden.`);
          // alert(`Kriterium "${teilkriterium.criterion}" nicht gefunden.`);
          return;
        }

        const payload = {
          teil_id: teil.teil_id,
          allgemeines_kriterium_id: matchedCriterion.allgemeines_kriterium_id || matchedCriterion.id,
          version_id: version.version_id,
          // produktgruppe_id: this.produktgruppeId,
          beschreibung: teilkriterium.description,
          gewichtsfaktor: teilkriterium.weighting,
          kennzahlwert: teilkriterium.klassifizierung ?? 0
        };

        this.dataService.saveTeileKriterien(payload).subscribe({
          next: () => {
            console.log('KennzahlTeilkriterium erfolgreich gespeichert:', payload);
          },
          error: (error) => {
            console.error('Fehler beim Speichern des KennzahlTeilkriteriums:', error);
            alert('Fehler beim Speichern des KennzahlTeilkriteriums. Bitte versuchen Sie es erneut.');
          }
        });
      });
    });
  });
}



  expandTextarea(event: any): void {
    event.target.classList.add('expanded');
  }

  // Textarea verkleinern
  shrinkTextarea(event: any): void {
    event.target.classList.remove('expanded');
  }

  // Auswahl einer Produktversion umschalten
  toggleVersionSelection(version: any): void {
    const index = this.selectedProduktversionen.indexOf(version);
    if (index > -1) {
      this.selectedProduktversionen.splice(index, 1);
    } else {
      this.selectedProduktversionen.push(version);
      this.initializeCriteriaForVersion(version);
    }
  }

  // Kriterien für die ausgewählte Version initialisieren
  initializeCriteriaForVersion(version: any): void {
    version.produktKriterien = JSON.parse(JSON.stringify(this.produktKriterien));  // Tiefes Kopieren der Produktkriterien
    version.teile = JSON.parse(JSON.stringify(this.relevantTeile));  // Tiefes Kopieren der Teile
     
  }

  // Finalisieren der ausgewählten Produktversionen
  finalizeProduktversionen(): void {
    if (this.selectedProduktversionen.length === 0) {
      alert('Bitte wählen Sie mindestens eine Produktversion aus.');
      return;
    }
    this.anzeigenTabellen = true;
    this.showKennzahlenBerechnenButton = true;
  }

  // Kennzahlen berechnen
  berechneKennzahlen(): void {
    const berechneKennzahl = (gewichtung: number, klassifizierung: number) => {
      if (Number.isFinite(klassifizierung) && Number.isFinite(gewichtung)) {
        return Math.round((gewichtung * klassifizierung) * 100) / 100;
      }
      return 'Ungültig';
    };

    this.produktKriterien.forEach((criterion: any) => {
      criterion.kennwert = berechneKennzahl(parseFloat(criterion.weighting), parseFloat(criterion.klassifizierung));
    });


    this.selectedProduktversionen.forEach(version => {
      version.produktKriterien = this.produktKriterien;
      version.teile.forEach((teil: any) => {
        teil.criteria.forEach((criterion: any) => {
          criterion.kennwert = berechneKennzahl(parseFloat(criterion.weighting), parseFloat(criterion.klassifizierung));
        });
      });
    });

    this.kennzahlenBerechnet = true;
    this.showEndbewertungButton = true;
    // console.log('Current produktKriterien:', this.produktKriterien);
    this.saveProduktKriterien();
  }

  // Endbewertung berechnen
  berechneEndbewertung(): void {
    this.saveAllKriterien();
    this.selectedProduktversionen.forEach(version => {
      const produktKennwert = this.produktKriterien.reduce((sum: number, criterion: any) => sum + (criterion.kennwert || 0), 0);
      
      version.endbewertung = [
        {
          name: 'Produkt',
          kennwert: produktKennwert.toFixed(2),
          gewicht: '1',
          endergebnis: produktKennwert.toFixed(2)
        },
        ...version.teile.map((teil: any) => {
          const teilKennwert = teil.criteria.reduce((sum: number, criterion: any) => sum + (criterion.kennwert || 0), 0);
          const endergebnis = (teilKennwert * teil.weight).toFixed(2);
          return {
            name: teil.name,
            kennwert: teilKennwert.toFixed(2),
            gewicht: teil.weight,
            endergebnis: parseFloat(endergebnis)
          };
        })
      ];
  
      version.reparierbarkeitsindex = parseFloat(
        version.endbewertung.reduce((sum: number, item: any) => sum + parseFloat(item.endergebnis), 0).toFixed(2)
      );
    });
  
    this.endbewertungAnzeigen = true;
    this.showVersionenVergleichenButton = true;
  }

  // Vergleicht die Versionen basierend auf ihrem Reparierbarkeitsindex
  versionenVergleichen(): void {
    this.vergleichsErgebnisse = this.selectedProduktversionen
      .map(version => ({
        versionName: version.versionName,
        reparierbarkeitsindex: version.reparierbarkeitsindex
      }))
      .sort((a, b) => b.reparierbarkeitsindex - a.reparierbarkeitsindex);

    this.vergleichsErgebnisseAnzeigen = true;
  }

  // Umschalten der vollständigen Tabelle
  toggleVollstaendigeTabelle(): void {
    this.vollstaendigeTabelleAnzeigen = !this.vollstaendigeTabelleAnzeigen;
  }
}

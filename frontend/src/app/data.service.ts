import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Produktgruppe } from './models/produktgruppe.model';
import { Teil } from './models/teil.model';  // Importiere das Interface für Teil 
import { KennzahlProduktkriterium } from './models/kennzahlProduktkriterium.model'; // Importiere das Interface für KennzahlProduktkriterium
import { KennzahlTeilkriterium } from './models/kennzahlTeilkriterien.model'; // Importiere das Interface für KennzahlTeilkriterium

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:8090/api'; // Basis-URL für das Backend

  constructor(private http: HttpClient) { }

  // Fehlerbehandlung
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Backend-Fehler:', error);
    return throwError(() => new Error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'));
  }

  // ------------------ Produktgruppen ------------------

  // Methode zum Speichern der Produktgruppe 
  addProduktgruppe(produktgruppe: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/produktgruppen`, produktgruppe).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Methode, um Produktgruppen abzurufen
  getProduktgruppen(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produktgruppen`).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Methode, um eine Produktgruppe zu bearbeiten
  updateProduktgruppe(id: number, produktgruppe: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/produktgruppen/${id}`, produktgruppe).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Methode, um eine Produktgruppe zu löschen (unabhängig von Bewertung)
  deleteProduktgruppe(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/produktgruppen/${id}`).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Produktgruppe mit Teilen und Versionen abrufen
  getProduktgruppeMitTeilenUndVersionen(produktgruppeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/produktgruppen/${produktgruppeId}/details`).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Funktion, um Teile einer bestimmten Produktgruppe abzurufen
  getTeileByProduktgruppe(produktgruppeId: number): Observable<Teil[]> {
    return this.http.get<Teil[]>(`${this.apiUrl}/produktgruppen/${produktgruppeId}/teile`);
  }

  // Methode zum Abrufen der Produktgruppe anhand ihrer ID
  getProduktgruppeById(produktgruppeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produktgruppen/${produktgruppeId}`)
      .pipe(
        catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
      );
  }

  // ------------------ Teile ------------------

  // Methode zum Speichern eines Teils (mit oder ohne Bewertung)
  addTeil(teil: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teile`, teil).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Methode zum Löschen eines Teils
  deleteTeil(teilId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teile/${teilId}`).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Methode zum Bearbeiten eines Teils
  updateTeil(teilId: number, updatedTeil: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teile/${teilId}`, updatedTeil).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Methode, um Teile für eine bestimmte Produktgruppe abzurufen
  getTeileForProduktgruppe(produktgruppeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/teile/produktgruppe/${produktgruppeId}`).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // -------------------- Versionen -----------------------

  // Methode zum Speichern einer Version (mit Verknüpfung zur Produktgruppe)
  addVersion(version: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/versionen`, version).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Methode zum Löschen einer Version
  deleteVersion(versionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/versionen/${versionId}`).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Methode zum Bearbeiten einer Version
  updateVersion(versionId: number, updatedVersion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/versionen/${versionId}`, updatedVersion).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Alle Versionen abrufen
  getAllVersionen(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/versionen`).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Methode, um Versionen für eine Produktgruppe nach ihrer ID abzurufen
  getVersionenForProduktgruppe(produktgruppeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/versionen?produktgruppe_id=${produktgruppeId}`).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // Methode, um die Versionen einer bestimmten Produktgruppe abzurufen
  getVersionenByProduktgruppe(produktgruppeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/versionen/produktgruppe/${produktgruppeId}`)
      .pipe(
        catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
      );
  }

  // Allgemeine Kriterien abrufen
  getAllgemeineKriterien(): Observable<any[]> {
    
    return this.http.get<any[]>(`${this.apiUrl}/allgemeine_kriterien`);
  }



  // -------------------- ProducktKriterien -----------------------
  // Methode zum Speichern der Produktkriterien für eine Produktgruppe


  saveProduktKriterium(kriterium:any): Observable<any> {
    const url = `${this.apiUrl}/produktgruppen/${kriterium.produktgruppe_id}/kriterien`;
    return this.http.post(url, kriterium).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }

  // --------------------- KennzahlTeilekriterium -----------------------
  // Methode zum Speichern eines KennzahlTeilkriteriums
  saveTeileKriterien(teilkriterium: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/kennzahl_teilkriterien`, teilkriterium).pipe(
      catchError(this.handleError) // Fehlerbehandlung bei der Anfrage
    );
  }


  //--------------------- GewichtderProduktKomponenten -------------------
  saveGewichtderProduktKomponente(teil:any):Observable<any>{
    const url =`${this.apiUrl}/gewicht_der_produkt_komponenten`;
    return this.http.post(url, teil).pipe(
      catchError(this.handleError)
    )
  }

  //-------------Bewertungsprozess -----------------------------------------

  // Neue Bewertung speichern
 
    createBewertungsprozess(bewertungsprozess: any) {
      console.log("Daten, die gesendet werden:", bewertungsprozess);
      return this.http.post(`${this.apiUrl}/bewertungsprozess`, bewertungsprozess)
        .pipe(catchError(this.handleError));
    }
    
  // Alle Bewertungen abrufen
  getAllBewertungsprozesse() {
    
    return this.http.get<any[]>(`${this.apiUrl}/bewertungsprozess`); // Korrigierter Endpunkt
  }

}

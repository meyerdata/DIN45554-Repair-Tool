export interface KennzahlProduktkriterium {
    kennzahl_produktkriterium_id: number,
    allgemeines_kriterium_id: number,
    produktgruppe_id: number, // Set your version_id accordingly
    beschreibung: string,
    gewichtsfaktor: number,
    kennzahlwert: number
}    
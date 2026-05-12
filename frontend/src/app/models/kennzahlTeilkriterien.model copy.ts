export interface KennzahlTeilkriterium { 
    teil_id:number,
    allgemeines_kriterium_id: number,
    produktgruppe_id: number, // Set your version_id accordingly
    beschreibung: string,
    gewichtsfaktor: number,
    kennzahlwert: number
}
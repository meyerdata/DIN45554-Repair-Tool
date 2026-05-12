// Model der Allgemeine Kriterien
export interface AllgemeineKriterium {
    allgemeines_kriterium_id: number; 
    name: string;
    beschreibung?: string;
    klassifizierung?: string; // Lokale Eigenschaft -> erst nur in Frontend
    description?: string; // Lokale Beschreibung -> erst nur in Frontend
    criterion?: string; // Lokales Feld für das Kriterium -> erst nur in Frontend
    weighting?: number; // Gewichtung -> erst nur in Frontend
    kennwert?: number; // Berechnungskennwert -> erst nur in Frontend
  }
  
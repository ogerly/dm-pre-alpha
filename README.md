# DreamMall Matching & Chat System

## Projektübersicht

Das DreamMall Matching-System ist eine webbasierte Anwendung, die Menschen basierend auf gemeinsamen Interessen, komplementären Fähigkeiten und ähnlichen Zielen vernetzt. Die Plattform ermöglicht es Nutzern, detaillierte Profile zu erstellen, potentielle Kollaborationspartner zu finden und direkt mit ihnen in Kontakt zu treten.

### Ziel
Die Hauptziele des Systems sind:
- Förderung von Zusammenarbeit zwischen Personen mit ergänzenden Fähigkeiten
- Identifikation gemeinsamer Interessen und Werte für bessere Teambildung
- Vernetzung von Menschen mit ähnlichen Visionen für nachhaltige Projekte
- Direkte Kommunikation zwischen potentiellen Partnern
- Geografische Darstellung von Nutzern, Projekten und Unternehmen auf einer interaktiven Karte

## Technische Implementierung

### Stack
- **Frontend Framework**: Vue.js 3
- **Build-Tool**: Vite
- **Datenmanagement**: JSON-basiert mit LocalStorage-Persistenz
- **Styling**: Vanilla CSS mit Flexbox und Grid für responsives Layout
- **Icons**: Font Awesome 5
- **Kartendarstellung**: Leaflet.js für interaktive Karten
- **Deployment**: Statische Webseite, lauffähig auf jedem modernen Webserver

### Architektur
Die Anwendung folgt einer komponentenbasierten Architektur:

```
/
├── components/                   # Vue-Komponenten
│   ├── UserList.vue              # Liste verfügbarer Nutzer
│   ├── UserProfile.vue           # Detailansicht eines Nutzerprofils
│   ├── MatchingResults.vue       # Anzeige der Matching-Ergebnisse
│   ├── UserProfileForm.vue       # Formular für Profileingabe/-bearbeitung
│   ├── chat/                     # Chat-Komponenten
│   │   ├── ChatContainer.vue     # Hauptcontainer für Chat-Funktionalitäten
│   │   ├── ChatList.vue          # Liste der Chatgespräche
│   │   └── ChatWindow.vue        # Chat-Interface für einzelne Gespräche
│   ├── map/                      # Karten-Komponenten
│   │   ├── MapPage.vue           # Hauptcontainer für Kartenansicht
│   │   └── MapView.vue           # Interaktive Kartenkomponente mit Markern
│   ├── debug/                    # Debug-Komponenten
│   │   ├── DataLoader.vue        # Tool zum direkten Laden von data.json
│   │   ├── DataDebugger.vue      # Anzeige und Inspektion der Nutzerdaten
│   │   └── TestMap.vue           # Vereinfachte Karte für Testfälle
├── services/                     # Geschäftslogik
│   ├── MatchingService.js        # Matching-Algorithmus und Bewertungsfunktionen
│   ├── StorageService.js         # Daten-Persistenz (LocalStorage)
│   └── ChatService.js            # Chat-Funktionalitäten
├── styles/                       # Ausgelagerte Styles
│   └── map-markers-custom.css    # Angepasste Styles für Kartenmarker
├── App.vue                       # Hauptkomponente
├── data.json                     # Beispieldaten für Nutzerprofile
├── index.html                    # HTML-Einstiegspunkt
├── main.js                       # JavaScript-Einstiegspunkt
├── style.css                     # Globale Stile
└── vite.config.js                # Vite-Konfiguration
```

## Features

### 1. Umfassende Nutzerprofile
Die Profile enthalten:
- Persönliche Informationen (Name, Bio)
- Fähigkeiten und Interessen
- Bildungs- und Berufserfahrung
- Eigene und beigetragene Projekte
- Standort- und Aktivitätsinformationen mit den Kategorien:
  - Home (Wohnort)
  - Firma
  - Wirkungsbereich
  - Unternehmen
  - Projekte
  - Tische/Meetups
- Unternehmensinformationen
- Persönliche Ziele und Werte
- Arbeits- und Kollaborationspräferenzen

### 2. Intelligenter Matching-Algorithmus
Der Algorithmus bewertet potentielle Matches anhand mehrerer Kriterien:
- **Gemeinsame Interessen**: 10 Punkte pro Übereinstimmung
- **Ergänzende Fähigkeiten**: 5 Punkte pro komplementärer Fähigkeit
- **Übereinstimmende Ziele**: Bis zu 15 Punkte (textbasierte Ähnlichkeitsanalyse)
- **DreamMall-spezifische Ziele**: Bis zu 20 Punkte für ähnliche Visionen
- **Ähnliche Projektbereiche**: Punktevergabe für inhaltlich verwandte Projekte
- **Gemeinsame Wertvorstellungen**: Zusätzliche Punktevergabe bei ähnlichen Werten

### 3. Kommunikations-System
- Integrierter Chat zwischen gematchten Nutzern
- Übersicht aller Gespräche
- Ungelesene Nachrichten-Anzeige
- Desktop- und Mobile-optimiertes Interface

### 4. Suche und Filterung
- Textbasierte Suche nach Namen, Fähigkeiten und Interessen
- Matching-Ergebnisse nach Kompatibilität sortiert

### 5. Profilverwaltung
- Erstellung neuer Profile mit umfangreichem Formular
- Bearbeiten bestehender Profile
- Löschen von Profilen
- Export und Import aller Profile als JSON

### 6. Interaktive Karte
Die interaktive Karte bietet eine geografische Darstellung aller Nutzerelemente:

- **Mehrere Marker-Typen**: Wohnorte, Firmen, Projekte, Meetups werden mit unterschiedlichen Icons angezeigt
  - Wohnorte (grün) - Privatadresse und Homeoffice-Standorte
  - Firmen (blau) und Unternehmen (orange) - Arbeitsplätze und Geschäftsstandorte
  - Projekte (rot) - Orte von laufenden und vergangenen Projekten
  - Meetups/Tische (türkis) - Veranstaltungsorte und regelmäßige Treffen
  - Wirkungsbereiche (lila) - Geografische Tätigkeitsbereiche
- **Filterung**: Nutzer können die Anzeige nach Marker-Typen filtern
- **Suchfunktion**: Textsuche nach Markern anhand von Namen oder Beschreibungen
- **Service-Gebiete**: Darstellung von Aktionsradien für Unternehmen
- **Detailansicht**: Klick auf Marker zeigt detaillierte Informationen und ermöglicht Navigation zum vollständigen Profil
- **Responsive Gestaltung**: Die Karte passt sich verschiedenen Bildschirmgrößen an
- **Automatischer Datenimport**: Die Karte erkennt fehlende Koordinaten und lädt automatisch die Datei data.json

#### Debug-Modus für die Karte

Die Karte verfügt über einen umfassenden Debug-Modus, der bei der Entwicklung und Fehlerbehebung hilft:

1. **Aktivierung**: Der Debug-Modus kann über die Checkbox "Debug-Modus aktivieren" oberhalb der Karte eingeschaltet werden

2. **Komponenten des Debug-Modus**:
   - **Data Loader**: Tool zum direkten Laden der data.json oder manueller Eingabe von JSON-Daten
   - **Asset Test**: Tester für die Verfügbarkeit verschiedener Ressourcen (z.B. data.json, Bildern)
   - **Test Map**: Vereinfachte Karte mit Testdaten zur Überprüfung der grundlegenden Leaflet-Funktionalität

3. **Data Loader-Funktionen**:
   - Anzeige des Datenstatus (Daten im Store, Koordinaten im Store, JSON geladen)
   - Auswahl verschiedener Pfade für die data.json-Datei
   - Manueller JSON-Eingabebereich für direkte Dateneingabe
   - Möglichkeit, Testpunkte hinzuzufügen (Standard-Koordinaten in Deutschland)
   - Vergleich zwischen aktuellen Daten und geladenen Daten

4. **Asset Test-Funktionen**:
   - Tests für die Verfügbarkeit von data.json auf verschiedenen Pfaden
   - Überprüfung der Netzwerkverbindung und des Asset-Ladens
   - Detaillierte Konsole zur Anzeige von Testergebnissen

5. **Debug-Datendisplay**:
   - Zeigt zusammenfassende Informationen über die verfügbaren Daten an
   - Anzahl der Benutzer, Unternehmen, Projekte und Meetups
   - Anzeige eines Beispiel-Benutzerprofils mit allen Details und Koordinaten

## Datenmodell

Das zentrale Datenmodell eines Nutzerprofils umfasst:

```json
{
  "id": 1,
  "name": "Max Mustermann",
  "bio": "Beschreibung der Person",
  "iconCategories": {
    "home": {
      "address": "München, Deutschland",
      "description": "Remote und lokale Arbeit möglich",
      "coordinates": [48.1351, 11.5820]
    },
    "firma": {
      "name": "Unternehmensname",
      "role": "Position",
      "year": "2023",
      "description": "Beschreibung",
      "coordinates": [48.1390, 11.5890]
    },
    "wirkungsbereich": [
      {"name": "München", "coordinates": [48.1351, 11.5820]},
      {"name": "Berlin", "coordinates": [52.5200, 13.4050]}
    ],
    "unternehmen": [
      {
        "name": "Unternehmensname",
        "role": "Position",
        "year": "2023",
        "description": "Beschreibung",
        "coordinates": [48.1390, 11.5890]
      }
    ],
    "projekt": [
      {
        "name": "Projektname",
        "description": "Projektbeschreibung",
        "year": "2022",
        "note": "Zusätzliche Informationen",
        "role": "Projektrolle",
        "coordinates": [48.1351, 11.5900]
      }
    ],
    "tisch": [
      {
        "name": "Meetup-Name",
        "description": "Beschreibung des Treffens",
        "location": "Ort des Treffens",
        "coordinates": [48.1400, 11.5800]
      }
    ]
  },
  "skills": ["Fähigkeit 1", "Fähigkeit 2"],
  "interests": ["Interesse 1", "Interesse 2"],
  "goals": "Allgemeine Ziele",
  "education": [
    {
      "period": "2015-2019",
      "title": "Abschluss",
      "institution": "Bildungseinrichtung"
    }
  ],
  "experience": [
    {
      "period": "2020-2022",
      "role": "Position",
      "company": "Unternehmen"
    }
  ],
  "ownProjects": [
    {
      "name": "Projektname",
      "description": "Projektbeschreibung",
      "year": "2022",
      "note": "Zusätzliche Informationen"
    }
  ],
  "contributedProjects": [
    {
      "name": "Projektname",
      "role": "Rolle im Projekt",
      "description": "Projektbeschreibung",
      "year": "2021"
    }
  ],
  "companies": [
    {
      "name": "Unternehmensname",
      "role": "Position",
      "year": "2023",
      "description": "Beschreibung"
    }
  ],
  "services": ["Service 1", "Service 2"],
  "dreammallGoals": "DreamMall-spezifische Ziele",
  "collaborationPreferences": "Präferenzen zur Zusammenarbeit",
  "leadershipPhilosophy": "Führungsphilosophie",
  "educationOpinion": "Meinung zum Bildungssystem",
  "valueOrientation": "Wertvorstellungen"
}
```

## Setup und Entwicklung

### Voraussetzungen
- Node.js (v14 oder höher)
- npm oder yarn

### Installation
1. Repository klonen
```bash
git clone <repository-url>
cd dreammall-matching-tamplate-profil
```

2. Abhängigkeiten installieren
```bash
npm install
```

3. Entwicklungsserver starten
```bash
npm run dev
```

4. Build für Produktion erstellen
```bash
npm run build
```

## Funktionsweise des Matching-Algorithmus

Der Algorithmus arbeitet in mehreren Schritten:

1. **Vergleich von Interessen**: Identifikation gemeinsamer Interessengebiete als Basis für erfolgreiche Zusammenarbeit

2. **Analyse komplementärer Fähigkeiten**: Erkennung sich ergänzender Fähigkeiten, die zu produktiven Teams führen können

3. **Zielkompatibilität**: Textbasierte Analyse der formulierten Ziele, um inhaltliche Übereinstimmungen zu erkennen

4. **Projekterfahrung**: Vergleich bisheriger Projekte, um ähnliche Tätigkeitsfelder zu erkennen

5. **Wertvorstellungen**: Abgleich persönlicher Präferenzen und Arbeitsweisen

Der Algorithmus berechnet einen Gesamtpunktwert und normalisiert diesen zu einem Prozentwert, der die Kompatibilität zwischen zwei Nutzern darstellt.

## Chat-System

Das Chat-System ermöglicht die direkte Kommunikation zwischen Nutzern:

1. **Konversationsverwaltung**: Jeder Nutzer sieht eine Liste seiner aktiven Gespräche
2. **Echtzeit-Kommunikation**: Textnachrichten werden in Echtzeit übertragen (im Prototyp simuliert)
3. **Lesebestätigung**: Ungelesene Nachrichten werden markiert
4. **Responsive Design**: Optimiert für Desktop- und Mobilgeräte

In der aktuellen Prototyp-Version werden die Chat-Daten lokal im Browser gespeichert. Für eine produktive Implementierung wäre eine serverseitige Integration mit WebSockets (z.B. Socket.io) und einer Datenbank erforderlich.

## Kartensystem

Das integrierte Kartensystem basiert auf Leaflet.js und ermöglicht die Visualisierung von Nutzer- und Projektstandorten:

1. **Marker-Typen**: Verschiedene Icon-Typen für unterschiedliche Kategorien
   - Wohnorte (grün)
   - Firmen und Unternehmen (blau/orange)
   - Projekte (rot)
   - Meetups/Tische (türkis)
   - Wirkungsbereiche (lila)

2. **Datenintegration**: Die Karte bezieht Daten aus den `iconCategories` der Nutzerprofile, wobei jede Kategorie Koordinaten-Arrays `[Breitengrad, Längengrad]` enthält.

3. **Service-Gebiete**: Für Unternehmen und Firmen werden kreisförmige Aktionsradien dargestellt, die den geografischen Wirkungsbereich visualisieren.

4. **Interaktivität**: Klicks auf Marker öffnen Infopanels mit Details und Verknüpfungen zu den entsprechenden Nutzerprofilen.

5. **Kartenfilterung**: Filter nach Markertyp und Suchfunktion für Namen und Beschreibungen.

6. **Auto-Zentrierung**: Die Karte zentriert sich automatisch auf die vorhandenen Marker.

7. **Debug-Werkzeuge**: Umfangreiche Debug-Tools für Entwicklung und Fehlerbehebung.

### Technische Details der Kartenimplementierung

- **Leaflet.js Integration**: Dynamisches Laden der Leaflet-Bibliothek zur Laufzeit
- **Koordinatenvalidierung**: Automatische Überprüfung und Filterung ungültiger Koordinaten
- **Marker-Icons**: Benutzerdefinierte Icons mit CSS für verschiedene Kategorien
- **Datenextraktion**: Automatische Extraktion von Koordinaten aus verschiedenen Profilbereichen
- **On-Demand-Rendering**: Marker werden nur für sichtbare Bereiche gerendert
- **Fehlertoleranz**: Robuste Fehlerbehandlung für ungültige oder fehlende Daten

### Troubleshooting für die Karte

Falls auf der Karte keine Marker angezeigt werden:

1. **Debug-Modus aktivieren**: Checkbox "Debug-Modus aktivieren" über der Karte anklicken
2. **Daten prüfen**: Im Debug-Panel wird angezeigt, ob die Nutzerdaten Koordinaten enthalten
3. **Datenstatus überprüfen**: Die drei Status-Indikatoren zeigen an, ob Daten vorhanden sind und Koordinaten enthalten
4. **Test-Karte**: Eine vereinfachte Test-Karte wird angezeigt, um die grundsätzliche Leaflet-Funktionalität zu prüfen
5. **Daten neu laden**: Button "Load data.json directly" klicken, um die originalen Daten mit Koordinaten zu laden
6. **Verschiedene Pfade ausprobieren**: Der Data-Loader bietet verschiedene Pfad-Optionen für die data.json
7. **Daten anwenden**: Button "Apply to Users" klicken, um die geladenen Daten auf die Anwendung anzuwenden
8. **Testpunkte hinzufügen**: Button "Add Test Points" fügt einen Testnutzer mit validen Koordinaten hinzu
9. **Konsole prüfen**: Die Browser-Konsole enthält detaillierte Logging-Informationen zur Fehlerdiagnose
10. **Asset-Verfügbarkeit testen**: Der Asset Test-Tab prüft die Erreichbarkeit der benötigten Ressourcen

Die Browser-Konsole enthält detaillierte Logging-Informationen zur Fehlerdiagnose.

## Datenschutz und Sicherheit

Die Anwendung speichert alle Daten lokal im Browser des Nutzers (LocalStorage) und überträgt keine Daten an externe Server. Der Nutzer behält volle Kontrolle über seine Daten und kann diese jederzeit exportieren oder löschen.

## Zukunftspläne und Erweiterungen

Geplante Erweiterungen für zukünftige Versionen:

- **Echtzeit-Chat**: Integration eines WebSocket-Servers für echte Echtzeit-Kommunikation
- **Verbesserte Textanalyse**: Integration fortschrittlicherer NLP-Algorithmen für genauere Textvergleiche
- **Profilbilder und Medien**: Upload und Anzeige von Bildern und anderen Medien
- **Erweiterte Kartenintegration**: 
  - Clustering von Markern bei hoher Dichte
  - Routing-Funktionalität zwischen Punkten
  - Import/Export von Koordinaten in gängigen Formaten (GeoJSON, KML)
- **Automatisierte Matching-Vorschläge**: Regelmäßige Benachrichtigungen über neue passende Profile
- **Projektvorschläge**: KI-basierte Vorschläge für mögliche Kollaborationsprojekte

## Lizenz

Diese Software steht unter der MIT-Lizenz - siehe die LICENSE-Datei für Details.

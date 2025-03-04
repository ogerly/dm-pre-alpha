# DreamMall Matching & Chat System

## Projektübersicht

Das DreamMall Matching-System ist eine webbasierte Anwendung, die Menschen basierend auf gemeinsamen Interessen, komplementären Fähigkeiten und ähnlichen Zielen vernetzt. Die Plattform ermöglicht es Nutzern, detaillierte Profile zu erstellen, potentielle Kollaborationspartner zu finden und direkt mit ihnen in Kontakt zu treten.

### Ziel
Die Hauptziele des Systems sind:
- Förderung von Zusammenarbeit zwischen Personen mit ergänzenden Fähigkeiten
- Identifikation gemeinsamer Interessen und Werte für bessere Teambildung
- Vernetzung von Menschen mit ähnlichen Visionen für nachhaltige Projekte
- Direkte Kommunikation zwischen potentiellen Partnern

## Technische Implementierung

### Stack
- **Frontend Framework**: Vue.js 3
- **Build-Tool**: Vite
- **Datenmanagement**: JSON-basiert mit LocalStorage-Persistenz
- **Styling**: Vanilla CSS mit Flexbox und Grid für responsives Layout
- **Icons**: Bootstrap Icons
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
├── services/                     # Geschäftslogik
│   ├── MatchingService.js        # Matching-Algorithmus und Bewertungsfunktionen
│   ├── StorageService.js         # Daten-Persistenz (LocalStorage)
│   └── ChatService.js            # Chat-Funktionalitäten
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
      "description": "Remote und lokale Arbeit möglich"
    },
    "firma": {
      "name": "Unternehmensname",
      "role": "Position",
      "year": "2023",
      "description": "Beschreibung"
    },
    "wirkungsbereich": ["München", "Berlin", "Remote (Europa)"],
    "unternehmen": [
      {
        "name": "Unternehmensname",
        "role": "Position",
        "year": "2023",
        "description": "Beschreibung"
      }
    ],
    "projekt": [
      {
        "name": "Projektname",
        "description": "Projektbeschreibung",
        "year": "2022",
        "note": "Zusätzliche Informationen",
        "role": "Projektrolle"
      }
    ],
    "tisch": [
      {
        "name": "Meetup-Name",
        "description": "Beschreibung des Treffens",
        "location": "Ort des Treffens"
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

## Datenschutz und Sicherheit

Die Anwendung speichert alle Daten lokal im Browser des Nutzers (LocalStorage) und überträgt keine Daten an externe Server. Der Nutzer behält volle Kontrolle über seine Daten und kann diese jederzeit exportieren oder löschen.

## Kartenintegration

Das System ist darauf vorbereitet, mit einer interaktiven Karte integriert zu werden. Die strukturierten Icon-Kategorien (Home, Firma, Wirkungsbereich, etc.) entsprechen den Markierungen, die auf einer Karte angezeigt werden können:

- **Home**: Wohnorte der Nutzer
- **Firma**: Unternehmensstandorte
- **Wirkungsbereich**: Aktionsradius eines Nutzers
- **Unternehmen**: Weitere Unternehmensstandorte
- **Projekt**: Projektstandorte
- **Tisch**: Meetup- und Veranstaltungsorte

## Zukunftspläne und Erweiterungen

Geplante Erweiterungen für zukünftige Versionen:

- **Echtzeit-Chat**: Integration eines WebSocket-Servers für echte Echtzeit-Kommunikation
- **Verbesserte Textanalyse**: Integration fortschrittlicherer NLP-Algorithmen für genauere Textvergleiche
- **Profilbilder und Medien**: Upload und Anzeige von Bildern und anderen Medien
- **Kartenintegration**: Anzeige von Nutzerprofilen auf einer interaktiven Karte
- **Automatisierte Matching-Vorschläge**: Regelmäßige Benachrichtigungen über neue passende Profile
- **Projektvorschläge**: KI-basierte Vorschläge für mögliche Kollaborationsprojekte

## Lizenz

Diese Software steht unter der MIT-Lizenz - siehe die LICENSE-Datei für Details.

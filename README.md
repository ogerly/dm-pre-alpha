# PROJEKTBESCHREIBUNG: DREAMMALL MATCHING & CHAT SYSTEM

Nachfolgend eine umfassende und verbesserte Projektbeschreibung in deutscher Sprache. Sie zeigt, dass es sich um eine Webanwendung handelt, die mit Vue 3, Vite, Pinia, Tailwind CSS und weiteren Technologien entwickelt wird. Die Dokumentation erfolgt mithilfe des Astro-Starlight-Frameworks. Abschließend ist der aktuelle Projektbaum aufgeführt, um die Ordner- und Dateistruktur zu veranschaulichen.

---

## Inhaltsverzeichnis
1. [Einleitung](#einleitung)
2. [Ziele](#ziele)
3. [Technische Umsetzung](#technische-umsetzung)
4. [Dokumentation mit Astro Starlight](#dokumentation-mit-astro-starlight)
5. [Projektstruktur (Basis)](#projektstruktur-basis)
6. [Funktionen im Überblick](#funktionen-im-überblick)
   1. [Umfassende Benutzerprofile](#1-umfassende-benutzerprofile)
   2. [Intelligenter Matching-Algorithmus](#2-intelligenter-matching-algorithmus)
   3. [Kommunikationssystem (Chat)](#3-kommunikationssystem-chat)
   4. [Suche und Filter](#4-suche-und-filter)
   5. [Profilverwaltung](#5-profilverwaltung)
   6. [Interaktive Karte](#6-interaktive-karte)
7. [Datenmodell](#datenmodell)
8. [Setup und Entwicklung](#setup-und-entwicklung)
   1. [Voraussetzungen](#voraussetzungen)
   2. [Installation](#installation)
   3. [Tailwind-CSS-Anpassungen](#tailwind-css-anpassungen)
9. [Funktionsweise des Matching-Algorithmus](#funktionsweise-des-matching-algorithmus)
10. [Chat-System](#chat-system)
11. [Kartensystem (Map)](#kartensystem-map)
    1. [Technische Details](#technische-details)
    2. [Fehlerbehebung (Troubleshooting)](#fehlerbehebung-troubleshooting)
12. [Komponentenübersicht](#komponentenübersicht)
13. [Datenschutz und Sicherheit](#datenschutz-und-sicherheit)
14. [Zukunftspläne und Erweiterungen](#zukunftspläne-und-erweiterungen)
15. [Lizenz](#lizenz)
16. [Aktueller Projektbaum](#aktueller-projektbaum)

---

## 1. Einleitung

**DreamMall Matching & Chat System** ist eine webbasierte Anwendung, die Menschen anhand gemeinsamer Interessen, ergänzender Fähigkeiten und ähnlicher Ziele zusammenbringt. Über ausführliche Benutzerprofile finden sich potenzielle Kooperationspartner, die direkt miteinander kommunizieren können.

---

## 2. Ziele

Die Hauptziele des Systems sind:

- Zusammenarbeit zwischen Menschen mit komplementären Fähigkeiten fördern
- Gemeinsame Interessen und Werte erkennen und für die Teambildung nutzen
- Personen mit ähnlichen Visionen vernetzen (z. B. nachhaltige Projekte)
- Direkte Kommunikation zwischen passenden Partnern ermöglichen
- Nutzer, Projekte und Unternehmen auf einer interaktiven Karte darstellen

---

## 3. Technische Umsetzung

- **Framework (Frontend)**: Vue 3
- **Build Tool**: Vite
- **State Management**: Pinia (zentraler, reaktiver Status)
- **CSS-Framework**: Tailwind CSS (inkl. eigener Erweiterungen)
- **Datenverwaltung**: JSON-basiert mit LocalStorage (Prototyp-/Testphase)
- **Icons**: Font Awesome 5 (optional via NPM oder CDN)
- **UI-Komponenten**: Flowbite (Erweiterung für Tailwind CSS)
- **Kartenanzeige**: Leaflet.js (bisher optional via NPM oder CDN)
- **Routing**: Vue Router (mit Auth-Guards)
- **Deployment**: Statische Website (z. B. Netlify, Vercel)
- **Fehlerverfolgung**: Eigenes Error-Tracking mit Logging
- **Dokumentation**: Astro + Starlight-Framework

---

## 4. Dokumentation mit Astro Starlight

Die Dokumentation entsteht mithilfe von Astro und dem Starlight-Framework. Wichtige Merkmale:

- **Moderne UI**: Responsive und ansprechend
- **Inhalte in Markdown/MDX**: Leicht zu pflegen und zu erweitern
- **Integrierte Suche**: Schnelle Auffindbarkeit von Themen
- **Klar strukturierte Navigation**: Übersichten und Unterkategorien
- **Code-Highlighting**: Syntaxhervorhebung für Codebeispiele
- **Responsive Design**: Optimiert für Mobilgeräte und Desktops

Der Ordner `/docs` enthält Skripte zum Erstellen (Build) und Testen der Dokumentation.

---

## 5. Projektstruktur (Basis)

Nachfolgend eine aktualisierte Ansicht der aktuellen Ordner- und Dateistruktur:

```
.
├── dist
│   ├── assets
│   ├── documentation
│   │   └── dist
│   │       ├── assets
│   │       ├── documentation
│   │       └── index.html
│   └── index.html
├── docs
│   ├── astro.config.mjs
│   ├── dist
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   ├── README.md
│   ├── src
│   │   ├── assets
│   │   ├── content
│   │   └── content.config.ts
│   └── tsconfig.json
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   └── documentation
│       └── dist
│           ├── assets
│           ├── documentation
│           └── index.html
├── README.md
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── data.json
│   │   ├── store-test-company-data.json
│   │   ├── store-test-login-data.json
│   │   ├── store-test-project-data.json
│   │   ├── store-test-table-data.json
│   │   ├── store-test-user-data.json
│   │   ├── style.css
│   │   └── styles
│   ├── components
│   │   ├── admin
│   │   ├── auth
│   │   ├── chat
│   │   ├── common
│   │   ├── company
│   │   ├── debug
│   │   ├── layout
│   │   ├── map
│   │   ├── matching
│   │   ├── project
│   │   ├── table
│   │   ├── user
│   │   └── videochat
│   ├── composables
│   ├── main.js
│   ├── public
│   ├── router
│   ├── services
│   ├── stores
│   └── views
│       ├── admin
│       ├── auth
│       ├── errors
│       ├── map
│       ├── matching
│       ├── user
│       ├── videochat
│       └── ...
├── tailwind.config.js
└── vite.config.js
```

---

## 6. Funktionen im Überblick

### 1. Umfassende Benutzerprofile

Ein Benutzerprofil enthält:
- Persönliche Daten (Name, Bio)
- Fähigkeiten (Skills) und Interessen
- Ausbildung und Berufserfahrung
- Eigene und mitgewirkte Projekte
- Geografische Informationen (Wohnort, Firma, Regionen usw.)
- Ziele, Werte und Kooperationspräferenzen

### 2. Intelligenter Matching-Algorithmus

Der Algorithmus vergibt Punkte nach:
- **Gemeinsamen Interessen** (10 Punkte pro Übereinstimmung)
- **Komplementären Fähigkeiten** (5 Punkte pro Ergänzung)
- **Zielübereinstimmung** (bis zu 15 Punkte durch Textanalyse)
- **DreamMall-spezifischen Zielen** (bis zu 20 Punkte)
- **Ähnlichen Projektbereichen** (weitere Punkte)
- **Gemeinsamen Werten** (Extrapunkte bei Wertübereinstimmung)

### 3. Kommunikationssystem (Chat)

- Chat direkt zwischen gematchten Nutzern
- Übersicht über alle Konversationen
- Anzeige ungelesener Nachrichten
- Für Desktop und Mobil optimierte Oberfläche

### 4. Suche und Filter

- Textsuche nach Name, Fähigkeiten, Interessen
- Sortierung nach Matching-Punktzahl

### 5. Profilverwaltung

- Neue Profile erstellen
- Profile bearbeiten
- Profile löschen
- Alle Profile als JSON importieren/exportieren

### 6. Interaktive Karte

- **Marker-Kategorien**: Wohnorte (grün), Firmen (blau/orange), Projekte (rot), Meetups (türkis), Einflussbereiche (lila)
- **Filterfunktion**: Ausblendung bestimmter Marker-Typen
- **Suchfunktion**: Marker nach Name oder Beschreibung auffindbar
- **Service-Radien**: Reichweite von Unternehmen anzeigen
- **Detail-Popups**: Klick auf Marker öffnet weitere Informationen
- **Responsives Design**: Kartenansicht passt sich verschiedenen Bildschirmgrößen an
- **Automatischer Datenimport**: Lädt fehlende Koordinaten aus `data.json`

#### Debug-Modus
- Aktivierung per „Enable Debug Mode“
- **DataLoader**: Lädt `data.json` oder nimmt manuelle JSON-Eingaben
- **AssetTest**: Prüft Ressourcenverfügbarkeit
- **TestMap**: Einfaches Leaflet-Beispiel zum Testen

---

## 7. Datenmodell

Ein JSON-Beispiel für ein Benutzerprofil:

```json
{
  "id": 1,
  "name": "Max Mustermann",
  "bio": "Beschreibung zur Person",
  "iconCategories": {
    "home": {
      "address": "München, Deutschland",
      "description": "Remote und lokal",
      "coordinates": [48.1351, 11.5820]
    },
    "company": {
      "name": "Firmenname",
      "role": "Position",
      "year": "2023",
      "description": "Beschreibung",
      "coordinates": [48.1390, 11.5890]
    },
    "areaOfInfluence": [
      { "name": "München", "coordinates": [48.1351, 11.5820] },
      { "name": "Berlin", "coordinates": [52.5200, 13.4050] }
    ],
    "business": [
      {
        "name": "Firma",
        "role": "Position",
        "year": "2023",
        "description": "Beschreibung",
        "coordinates": [48.1390, 11.5890]
      }
    ],
    "project": [
      {
        "name": "Projektname",
        "description": "Projektbeschreibung",
        "year": "2022",
        "note": "Zusätzliche Infos",
        "role": "Projektrolle",
        "coordinates": [48.1351, 11.5900]
      }
    ],
    "table": [
      {
        "name": "Meetup",
        "description": "Beschreibung des Treffens",
        "location": "Ort",
        "coordinates": [48.1400, 11.5800]
      }
    ]
  },
  "skills": ["Skill 1", "Skill 2"],
  "interests": ["Interessengebiet 1", "Interessengebiet 2"],
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
      "company": "Firma"
    }
  ],
  "ownProjects": [
    {
      "name": "Eigenes Projekt",
      "description": "Beschreibung",
      "year": "2022",
      "note": "Zusätzliche Infos"
    }
  ],
  "contributedProjects": [
    {
      "name": "Projektname",
      "role": "Mitarbeit",
      "description": "Beschreibung",
      "year": "2021"
    }
  ],
  "companies": [
    {
      "name": "Firma XYZ",
      "role": "Position",
      "year": "2023",
      "description": "Beschreibung"
    }
  ],
  "services": ["Service 1", "Service 2"],
  "dreammallGoals": "Spezifische Ziele",
  "collaborationPreferences": "Kooperationspräferenzen",
  "leadershipPhilosophy": "Führungsphilosophie",
  "educationOpinion": "Meinung zum Bildungssystem",
  "valueOrientation": "Werteorientierung"
}
```

---

## 8. Setup und Entwicklung

### 8.1. Voraussetzungen
- Node.js (ab Version 14)
- npm oder yarn

### 8.2. Installation
1. Repository klonen:
   ```bash
   git clone <repository-url>
   cd dreammall-matching-tamplate-profil
   ```
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
3. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```
4. Produktionsbuild erstellen:
   ```bash
   npm run build
   ```

### 8.3. Tailwind-CSS-Anpassungen
- **Farbschema**: Eigene Farben (z. B. `primary`, `secondary`)
- **Custom Components**: Wiederverwendbare Klassen wie `.btn`, `.btn-primary`, `.card`
- **Shadows**: Eigene Shadow-Definitionen

Konfiguration in `tailwind.config.js`, eingebunden über `@layer components` in `src/assets/styles/tailwind.css`.

---

## 9. Funktionsweise des Matching-Algorithmus
1. **Interessen-Abgleich**: Gemeinsame Interessenschwerpunkte
2. **Ergänzende Fähigkeiten**: Komplementäre Skills
3. **Zielkompatibilität**: Analyse formulierter Ziele (Text ähnlich)
4. **Projekt-Erfahrung**: Abgleich bisheriger Projekte
5. **Werteabgleich**: Prüfung persönlicher Präferenzen und Arbeitsstile

Der Gesamtwert (Score) wird am Ende prozentual normalisiert, um die Kompatibilität zu kennzeichnen.

---

## 10. Chat-System
- **Konversationsübersicht**: Alle laufenden Chats im Blick
- **Echtzeitübertragung** (Prototyp-Simulation)
- **Gelesen-/Ungelesen-Indikator**
- **Responsives Interface** für verschiedene Endgeräte

Für eine Produktionsumgebung empfiehlt sich eine Anbindung an WebSockets (z. B. Socket.io) und eine Datenbank.

---

## 11. Kartensystem (Map)

Basierend auf Leaflet.js werden Nutzer- und Projektstandorte geografisch visualisiert:

- **Verschiedene Marker-Arten**: Wohnorte, Firmen, Projekte, Meetups, Einflussbereiche
- **Datenintegration**: Koordinaten aus `iconCategories`
- **Servicebereiche**: Zirkulare Radien für Firmen/Businesses
- **Interaktion**: Popup-Informationen bei Klick auf Marker
- **Filter-/Suchoptionen**: Marker nach Typ oder Namen filtern
- **Auto-Zentrierung**: Die Karte fokussiert verfügbare Marker
- **Debug-Modus**: Zusätzliche Tools zum Laden von Daten und Prüfen von Assets

### 11.1. Technische Details
- Dynamische Integration von Leaflet
- Plausibilitätsprüfung von Koordinaten
- Eigene Icons per CSS
- On-Demand Rendering für sichtbare Bereiche
- Robustes Error Handling bei fehlerhaften Daten

### 11.2. Fehlerbehebung (Troubleshooting)

Wenn keine Marker erscheinen:
1. **Debug Mode** aktivieren
2. Datenstatus im Debug-Panel prüfen
3. `data.json` direkt laden
4. Unterschiedliche Pfade für das JSON testen
5. "Apply to Users" anwenden
6. Testpunkte hinzufügen
7. Konsole (Browser DevTools) checken
8. **Asset Test** durchführen

---

## 12. Komponentenübersicht

Die Anwendung besteht aus folgenden Kernkomponenten:
- **Auth**: Login/Registrierung, Passwort-Reset
- **Chat**: `ChatOverlay`, `ChatContainer`, `ChatList`, `ChatWindow`
- **Company**: `CompanyForm`, `CompanyView` sowie Firmenliste
- **Debug**: `DataLoader`, `AssetTest`, `TestMap`, `DataDebugger`
- **Layout**: `AppHeader`, `AppActions`
- **Map**: `MapPage`, `MapView`, `MapLoading`
- **Matching**: `MatchingContainer`, `MatchingResults`
- **Project**: `ProjectForm`, `ProjectView`
- **Table**: `TableForm`, `TableView`, ggf. Meetups & Kalender
- **User**: `UserList`, `UserProfile`, `UserProfileForm`

---

## 13. Datenschutz und Sicherheit

Sämtliche Daten werden lokal im Browser (LocalStorage) gespeichert und nicht an externe Server übertragen. Nutzer behalten dadurch volle Kontrolle und können Daten bei Bedarf exportieren oder entfernen.

---

## 14. Zukunftspläne und Erweiterungen

- **Echter Echtzeit-Chat** (WebSockets, Datenbank)
- **Fortschrittlichere Textanalyse** (NLP für genauere Übereinstimmungen)
- **Profilbilder und Medien** (Upload, Anzeige)
- **Umfassendere Kartenfunktionen** (Clustering, Routing, Import/Export in GeoJSON oder KML)
- **Automatisierte Match-Vorschläge** (Benachrichtigungen bei neuen Profilen)
- **Projektvorschläge** (KI-gestützt)
- **UI-Verbesserungen** (Dark Mode, Mobile-Optimierungen, Barrierefreiheit)

---

## 15. Lizenz

Dieses Projekt steht unter der [MIT License](LICENSE).

---

## 16. Aktueller Projektbaum

Unten eine Übersicht des aktuellen Projektbaums, einschließlich Build-Ordner und Dokumentationsstruktur:

```
.
├── dist
│   ├── assets
│   ├── documentation
│   │   └── dist
│   │       ├── assets
│   │       ├── documentation
│   │       └── index.html
│   └── index.html
├── docs
│   ├── astro.config.mjs
│   ├── dist
│   │   ├── 404.html
│   │   ├── _astro
│   │   ├── favicon.svg
│   │   ├── guides
│   │   ├── index.html
│   │   ├── pagefind
│   │   └── reference
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   ├── README.md
│   ├── src
│   │   ├── assets
│   │   ├── content
│   │   └── content.config.ts
│   └── tsconfig.json
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   └── documentation
│       └── dist
│           ├── assets
│           ├── documentation
│           └── index.html
├── README.md
├── src
│   ├── App.vue
│   ├── assets
│   │   ├── data.json
│   │   ├── store-test-company-data.json
│   │   ├── store-test-login-data.json
│   │   ├── store-test-project-data.json
│   │   ├── store-test-table-data.json
│   │   ├── store-test-user-data.json
│   │   ├── style.css
│   │   └── styles
│   ├── components
│   │   ├── admin
│   │   │   └── AdminPanel.vue
│   │   ├── auth
│   │   │   └── LoginPage.vue
│   │   ├── chat
│   │   │   ├── ChatContainer.vue
│   │   │   ├── ChatList.vue
│   │   │   ├── ChatOverlay.vue
│   │   │   └── ChatWindow.vue
│   │   ├── common
│   │   │   └── TabGroup.vue
│   │   ├── company
│   │   │   ├── CompanyForm.vue
│   │   │   └── CompanyView.vue
│   │   ├── debug
│   │   │   ├── AssetTest.vue
│   │   │   ├── DataDebugger.vue
│   │   │   ├── DataLoader.vue
│   │   │   ├── ErrorConsole.vue
│   │   │   └── TestMap.vue
│   │   ├── layout
│   │   │   ├── AppActions.vue
│   │   │   └── AppHeader.vue
│   │   ├── map
│   │   │   ├── MapLoading.vue
│   │   │   ├── MapPage.vue
│   │   │   └── MapView.vue
│   │   ├── matching
│   │   │   ├── MatchingContainer.vue
│   │   │   └── MatchingResults.vue
│   │   ├── project
│   │   │   ├── ProjectForm.vue
│   │   │   └── ProjectView.vue
│   │   ├── table
│   │   │   ├── TableForm.vue
│   │   │   └── TableView.vue
│   │   ├── user
│   │   │   ├── UserList.vue
│   │   │   ├── UserOverview.vue
│   │   │   ├── UserProfileForm.vue
│   │   │   ├── UserProfile.vue
│   │   │   └── UserSettings.vue
│   │   └── videochat
│   │       └── VideoChat.vue
│   ├── composables
│   │   └── useErrorTracking.js
│   ├── main.js
│   ├── public
│   ├── router
│   │   └── index.js
│   ├── services
│   │   ├── ChatService.js
│   │   ├── errorLogger.js
│   │   ├── MatchingService.js
│   │   ├── StorageService.js
│   │   └── WebRTCService.js
│   ├── stores
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── ui.js
│   │   └── user.js
│   └── views
│       ├── admin
│       │   └── AdminView.vue
│       ├── AdminboardPage.vue
│       ├── auth
│       │   └── LoginView.vue
│       ├── DashboardPage.vue
│       ├── errors
│       │   └── NotFoundView.vue
│       ├── HomePage.vue
│       ├── HomeView.vue
│       ├── map
│       │   └── MapView.vue
│       ├── MapView.vue
│       ├── matching
│       │   └── MatchingView.vue
│       ├── MatchingView.vue
│       ├── NotFoundPage.vue
│       ├── ProjectsView.vue
│       ├── TableView.vue
│       ├── user
│       │   ├── UserProfileView.vue
│       │   └── UserSettingsView.vue
│       ├── videochat
│       │   └── VideoChatView.vue
│       └── VideoChatView.vue
├── tailwind.config.js
└── vite.config.js
```

---

**Ende der strukturierten Projektbeschreibung**


# ❤️ Praxis mit Herz - Website

Dieses Repository beinhaltet den Quellcode der Website der Praxis mit Herz.

## 🔍 Projektüberblick

Diese Website dient als digitale Visitenkarte der Praxis und bietet u. a. Informationen zu:

- Behandlungsschwerpunkte und Leistungen
- Philosophie und Werte der Praxis
- Kontaktmöglichkeiten und Anfahrt
- Öffnungszeiten und Terminvereinbarungen

## 🚀 Technologien

- [Astro](https://astro.build/) – moderner, komponentenbasierter Static Site Generator (SSG)
- [Markdown](https://docs.astro.build/de/guides/markdown-content/) für Inhalte
- [Tailwind CSS](https://tailwindcss.com/) CSS für das Styling
- [GitHub Pages](https://docs.astro.build/en/guides/deploy/github/) für das Hosting

## 🛠️ Projektstruktur

```text
/
├── public/           # Statische Assets (z. B. Bilder, CNAME)
├── src/
│   ├── components/   # Wiederverwendbare Komponenten
│   ├── layouts/      # Layout-Vorlagen
│   └── pages/        # Seiten (z. B. index.astro)
├── astro.config.mjs  # Astro-Konfiguration
└── package.json      # Projektabhängigkeiten
```

## 🧪 Lokale Entwicklung

Voraussetzungen: [Node.js](https://nodejs.org/) (v18 oder höher)

```bash
# Projekt initialisieren
npm install

# Lokalen Entwicklungsserver starten
npm run dev
```

Die Website ist dann unter [localhost:4321](http://localhost:4321) erreichbar.

## 📦 Deployment

Die Website wird automatisch über GitHub Actions auf GitHub Pages bereitgestellt. 
Für benutzerdefinierte Domains wird eine CNAME-Datei im public/-Verzeichnis verwendet.

## 🧞 Befehlsübersicht

Alle Befehle werden vom Hauptverzeichnis des Projekts über das Terminal ausgeführt.

| Command                   | Action                                                           |
| :------------------------ |:-----------------------------------------------------------------|
| `npm install`             | Installiert Abhängigkeiten                                       |
| `npm run dev`             | Startet den lokalen Entwicklungsserver auf `localhost:4321`      |
| `npm run build`           | Baut die Production Webseite in `./dist/`                        |
| `npm run preview`         | Erlaubt einen Preview der Production Webseite vor dem Deployment |
| `npm run astro ...`       | Ausführen von CLI Befehlen wie `astro add`, `astro check`        |
| `npm run astro -- --help` | Hilfe bekommen die Astro CLI zu nutzen                           |

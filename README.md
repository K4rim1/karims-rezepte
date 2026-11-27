# Karim’s Rezepte

Rezepte speichern, Koch-Videos von TikTok und Instagram übernehmen und Einkaufslisten mit ungefähren Preisen von Hofer, Lidl, Spar, Billa und Penny erstellen. Die App läuft als Web-App, ist gratis und funktioniert auch offline.

**App-Adresse:** https://k4rim1.github.io/karims-rezepte/

## Aufs iPhone holen

1. Die Adresse in **Safari** öffnen.
2. Teilen-Symbol → **Zum Home-Bildschirm** → **Hinzufügen**. (Den Namen kannst du dort noch kürzen, falls er unter dem Symbol abgeschnitten wird.)
3. Ab jetzt immer über das neue Symbol öffnen. Safari und die Home-Bildschirm-App speichern Rezepte getrennt.

## So ist die App aufgebaut

Unten gibt es vier Bereiche:

- **Rezepte** – alle Rezepte als Karten mit Foto, Suche, Sortierung, **Favoriten** (Stern) und **Ordner** (z. B. „Meal Prep“). Mit **+** holst du ein Rezept aus der Zwischenablage, fügst Text ein oder schreibst es selbst.
- **Planer** – Wochenansicht Montag bis Sonntag. Rezepte (mit Portionen) oder Notizen wie „Essen gehen“ auf Tage legen. **Einkaufen** legt alle Zutaten der Woche auf die Einkaufsliste.
- **Einkauf** – oben die Rezepte mit ihren Portionen, darunter die zusammengerechneten Zutaten mit Preisen, sortiert nach Supermarkt. Bei jeder Zutat steht, für welches Rezept sie ist.
- **Mehr** – Anleitungen für die Kurzbefehle, Ordner verwalten, Supermärkte, Backup.

Im Rezept: Favorit, Planen, Einkaufen und Ordner mit einem Tipp. Portionen rechnen alle Mengen um. Zeitangaben in den Schritten („10 Minuten“) starten einen **Timer**, der **Kochmodus** zeigt Schritt für Schritt große Schrift samt der Zutaten für diesen Schritt. Eigene Rezepte schreibst du mit Foto, Zutatenzeilen (Menge + Zutat), Gruppen und Schritten; die Reihenfolge änderst du am Griff ⋮⋮. Unfertige Rezepte bleiben als Entwurf erhalten.

## Rezepte holen (TikTok, Instagram, Osta, Webseiten)

Die Schritt-für-Schritt-Anleitung steht in der App unter **Mehr → Rezepte holen**. Jede Aktion findest du in der Kurzbefehle-App über das Suchfeld unten („Aktionen suchen“) mit dem angegebenen Suchwort.

### Am einfachsten: „Rezept vom Bildschirm“ mit der Aktionstaste

1. Kurzbefehle → **+** → oben auf den Namen → **Umbenennen** → „Rezept vom Bildschirm“.
2. Aktionen: **Bildschirmfoto aufnehmen** → **Text aus Bild extrahieren** → (optional, ab iPhone 15 Pro) **Modell verwenden** mit der Anweisung aus der App → **In Zwischenablage kopieren** → **Mitteilung anzeigen**.
3. iPhone-Einstellungen → **Aktionstaste** → **Kurzbefehl** → „Rezept vom Bildschirm“. (Ohne Aktionstaste: Bedienungshilfen → Tippen → Auf Rückseite tippen.)

Benutzen: Beschreibung aufklappen → Aktionstaste → Karim’s Rezepte öffnen → **Geteiltes Rezept einfügen**. Erkannte Rezepte werden direkt gespeichert.

### Webseiten & Osta: „Rezept aus Webseite“

Liest Rezept und Foto aus einer Seite, die in Safari offen ist (Chefkoch, Rezeptblogs, geteilte Osta-Links). Aufbau: Details (ⓘ) → **Im Share-Sheet anzeigen** · **JavaScript auf Webseite ausführen** (Skript per Kopierknopf aus der App) · **In Zwischenablage kopieren** (Ergebnis von JavaScript) · **Mitteilung anzeigen**.

### Nur TikTok: „Rezept speichern“ über Teilen

Holt die Beschreibung über den TikTok-Link (oEmbed). TikTok schickt sie nicht mehr bei jedem Video mit – dann hilft die Aktionstaste.

## KI-Erkennung (optional)

Unter **Mehr → KI-Erkennung** kannst du einen eigenen API-Schlüssel von **Claude** (platform.claude.com) oder **Google Gemini** (aistudio.google.com/apikey) eintragen. Dann ordnet eine KI jeden eingefügten Text – auch unordentliche Rezepte von Freunden –, übersetzt auf Deutsch und rechnet Einheiten um. Zusätzlich kannst du Rezepte **aus Fotos oder Screenshots** holen (+ → Aus Fotos oder Screenshots) und gespeicherte Rezepte **mit KI überarbeiten** (im Rezept ⋯). Der Schlüssel bleibt nur auf dem Gerät und kommt in kein Backup. Ohne Internet oder Schlüssel erkennt die App Rezepte wie bisher mit Regeln. Gratis-Alternative: der Schritt **Modell verwenden** (Apple Intelligence) in den Kurzbefehlen.

## Einkaufsliste und Preise

- Im Rezept die **Portionen** einstellen und **Einkaufen** tippen – oder im Planer **Einkaufen** für die ganze Woche. Die Portionen pro Rezept änderst du jederzeit oben in der Einkaufsliste.
- Gleiche Zutaten aus mehreren Rezepten werden zusammengezählt. Salz, Öl, Gewürze & Co. stehen unter „Hast du wahrscheinlich daheim“.
- **Günstigste Mischung** zeigt jede Zutat beim billigsten Laden; tippst du auf einen Laden, siehst du alles dort.
- Die Preise kommen jeden Morgen automatisch von **heisse-preise.io**, einem Open-Source-Preisvergleich für österreichische Supermärkte. Es sind Richtwerte; die Zuordnung Produkt ↔ Zutat passiert über den Produktnamen. Prüfen kannst du sie unter https://k4rim1.github.io/karims-rezepte/preise-check.txt
- **Hofer** kommt jeden Morgen direkt von hofer.at. Hofer zeigt online aber nur einen Teil des Sortiments (vor allem Milchprodukte, Fleisch, Brot, Fisch, Aktionen); für den Rest nimmt die App den letzten bekannten Hofer-Preis von heisse-preise.io und zeigt dessen Datum an. **Billa** ist tagesaktuell, **Spar** so aktuell wie heisse-preise.io. **Lidl** veröffentlicht seine normalen Preise nicht online (nur Flugblatt-Aktionen) und fehlt deshalb; **Penny** ist in den Daten nicht enthalten.
- Zutaten, die die App nicht kennt (z. B. Sriracha, Kapern, Reispapier), sucht sie unter allen rund 15.000 Lebensmitteln in **produkte.json** und markiert Treffer mit ≈. Mit eingerichteter KI-Erkennung übersetzt die KI solche Zutaten zuerst in übliche österreichische Produktnamen und schätzt den Preis, wenn gar nichts passt („KI-Schätzung“).

## Wartung

- **Preise veraltet?** Auf GitHub im Repository **Actions → Kochbuch veröffentlichen → Run workflow**. GitHub pausiert tägliche Abläufe, wenn im Repository längere Zeit nichts passiert.
- **Backup:** In der App unter **Mehr → Backup speichern** (z. B. in iCloud Drive). Das Backup enthält Rezepte, Fotos, Ordner und Wochenplan. Wenn du die App vom Home-Bildschirm löschst, sind auch die Rezepte weg.
- **Am PC:** Adresse in Chrome oder Edge öffnen → in der Adressleiste **App installieren**. Rezepte überträgst du mit Backup speichern / laden.
- Öffentlich ist nur der App-Code in diesem Repository. Rezepte und Einkaufslisten liegen nur auf deinem Gerät.

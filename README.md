# Karim’s Rezepte

Rezepte speichern, Koch-Videos von TikTok und Instagram übernehmen und Einkaufslisten mit ungefähren Preisen von Hofer, Lidl, Spar, Billa und Penny erstellen. Die App läuft als Web-App, ist gratis und funktioniert auch offline.

**App-Adresse:** https://k4rim1.github.io/karims-rezepte/

## Aufs iPhone holen

1. Die Adresse in **Safari** öffnen.
2. Teilen-Symbol → **Zum Home-Bildschirm** → **Hinzufügen**. (Den Namen kannst du dort noch kürzen, falls er unter dem Symbol abgeschnitten wird.)
3. Ab jetzt immer über das neue Symbol öffnen. Safari und die Home-Bildschirm-App speichern Rezepte getrennt.

## Teilen aus TikTok und Instagram

Die Schritt-für-Schritt-Anleitung steht in der App unter dem **Regler-Symbol oben rechts → Hilfe & Backup**. Jede Aktion findest du in der Kurzbefehle-App über das Suchfeld unten („Aktionen suchen“) mit dem angegebenen Suchwort.

### Am einfachsten: „Rezept vom Bildschirm“ (Instagram & TikTok)

1. Kurzbefehle → **+** → oben auf den Namen → **Umbenennen** → „Rezept vom Bildschirm“.
2. Aktionen hinzufügen: **Bildschirmfoto aufnehmen** (Suchwort „Bildschirmfoto“) → **Text aus Bild extrahieren** („Text aus Bild“) → **In Zwischenablage kopieren** („Zwischenablage“) → **Mitteilung anzeigen** („Mitteilung“).
3. iPhone-Einstellungen → **Bedienungshilfen** → **Tippen** → **Auf Rückseite tippen** → **Doppeltippen** → „Rezept vom Bildschirm“. (Oder bei iPhones mit Aktionstaste: Einstellungen → **Aktionstaste** → **Kurzbefehl**.)

Benutzen: Beschreibung im Video mit „mehr“ aufklappen → zweimal auf die Rückseite tippen → Karim’s Rezepte öffnen → **Geteiltes Rezept einfügen** → prüfen → **Speichern**. Passt der Text nicht auf einen Bildschirm: unter **+ Rezept → Aus Video-Beschreibung** den ersten Teil einfügen, weiterscrollen, nochmal tippen und **Teil anhängen**.

### Zusätzlich für TikTok: „Rezept speichern“ über Teilen

Holt die komplette Beschreibung über den Link. Aufbau: Details (ⓘ) → **Im Share-Sheet anzeigen** · **URL erweitern** (Kurzbefehleingabe) · **Text** `https://www.tiktok.com/oembed?url=` + Erweiterte URL · **Inhalte von URL abrufen** · **Wörterbuchwert abrufen** (Schlüssel `title`) · **In Zwischenablage kopieren** · **Mitteilung anzeigen**.

## Einkaufsliste und Preise

- Im Rezept die **Portionen** mit − / + einstellen und **Auf die Einkaufsliste** tippen – oder oben auf das **Wagen-Symbol**.
- Gleiche Zutaten aus mehreren Rezepten werden zusammengezählt. Salz, Öl, Gewürze & Co. stehen unter „Hast du wahrscheinlich daheim“.
- **Günstigste Mischung** zeigt jede Zutat beim billigsten Laden; tippst du auf einen Laden, siehst du alles dort.
- Die Preise kommen jeden Morgen automatisch von **heisse-preise.io**, einem Open-Source-Preisvergleich für österreichische Supermärkte. Es sind Richtwerte; die Zuordnung Produkt ↔ Zutat passiert über den Produktnamen. Prüfen kannst du sie unter https://k4rim1.github.io/karims-rezepte/preise-check.txt
- Stand November 2026 liefert die Quelle nur für **Billa** tagesaktuelle Preise. **Spar** ist zuletzt vom 27.09.2026, **Hofer** vom 07.11.2025 – die App zeigt das Datum an und blendet Läden mit Daten älter als vier Monate standardmäßig aus (in Hilfe & Backup einschaltbar). **Lidl und Penny** sind in den Daten nicht enthalten. Sobald heisse-preise.io wieder aktuelle Daten liefert, übernimmt die App sie automatisch.

## Wartung

- **Preise veraltet?** Auf GitHub im Repository **Actions → Kochbuch veröffentlichen → Run workflow**. GitHub pausiert tägliche Abläufe, wenn im Repository längere Zeit nichts passiert.
- **Backup:** In der App unter Hilfe & Backup → **Backup speichern** (z. B. in iCloud Drive). Wenn du die App vom Home-Bildschirm löschst, sind auch die Rezepte weg.
- **Am PC:** Adresse in Chrome oder Edge öffnen → in der Adressleiste **App installieren**. Rezepte überträgst du mit Backup speichern / laden.
- Öffentlich ist nur der App-Code in diesem Repository. Rezepte und Einkaufslisten liegen nur auf deinem Gerät.

# Karim’s Rezepte

Rezepte speichern, Koch-Videos von TikTok und Instagram übernehmen und Einkaufslisten mit ungefähren Preisen von Hofer, Lidl, Spar, Billa und Penny erstellen. Die App läuft als Web-App, ist gratis und funktioniert auch offline.

**App-Adresse:** https://k4rim1.github.io/karims-rezepte/

## Aufs iPhone holen

1. Die Adresse in **Safari** öffnen.
2. Teilen-Symbol → **Zum Home-Bildschirm** → **Hinzufügen**. (Den Namen kannst du dort noch kürzen, falls er unter dem Symbol abgeschnitten wird.)
3. Ab jetzt immer über das neue Symbol öffnen. Safari und die Home-Bildschirm-App speichern Rezepte getrennt.

## Teilen aus TikTok und Instagram

Die Schritt-für-Schritt-Anleitung für die zwei Kurzbefehle steht in der App unter dem **Regler-Symbol oben rechts → Hilfe & Backup**.

### Kurzbefehl 1: „Rezept speichern“ (TikTok und Text)

1. App **Kurzbefehle** öffnen → **+** → Name: **Rezept speichern**.
2. Unten auf **ⓘ** → **Im Share-Sheet anzeigen** aktivieren. Oben „Empfangen: Alle Typen“ antippen → nur **Text** und **URLs** anlassen.
3. Aktion **Wenn** (If) hinzufügen. Bedingung: **Kurzbefehleingabe** · **enthält** · `tiktok`
4. In den **Wenn**-Teil nacheinander:
   - **URLs aus Eingabe abrufen** (Get URLs from Input) – Eingabe: Kurzbefehleingabe
   - **URL erweitern** (Expand URL)
   - **Text** – Inhalt: `https://www.tiktok.com/oembed?url=` und direkt dahinter die Variable **Erweiterte URL**
   - **Inhalte von URL abrufen** (Get Contents of URL)
   - **Wörterbuchwert abrufen** (Get Dictionary Value) – Schlüssel: `title`
   - **Text** – Inhalt: Variable **Wörterbuchwert**, neue Zeile, Variable **Erweiterte URL**
   - **In Zwischenablage kopieren** (Copy to Clipboard)
5. In den **Sonst**-Teil: **In Zwischenablage kopieren** mit **Kurzbefehleingabe**.
6. Ganz unten nach **Ende**: **Mitteilung anzeigen** (Show Notification) – „Rezept kopiert – Karim’s Rezepte öffnen und einfügen“.

### Kurzbefehl 2: „Rezept aus Screenshot“ (Instagram)

Instagram gibt beim Teilen nur den Link weiter, nicht die Beschreibung. Dieser Kurzbefehl liest den Text deshalb aus Screenshots – direkt auf dem iPhone.

1. Neuer Kurzbefehl, Name **Rezept aus Screenshot**. Unter **ⓘ** „Im Share-Sheet anzeigen“ aktivieren, als Typ nur **Bilder**.
2. **Wiederholen mit jedem Objekt** (Repeat with Each) – in: Kurzbefehleingabe
3. Darin: **Text aus Bild extrahieren** (Extract Text from Image) – Bild: Wiederholungsobjekt
4. Nach **Wiederholung beenden**: **Text kombinieren** (Combine Text) – Wiederholungsergebnisse, Trennzeichen: Neue Zeile
5. **In Zwischenablage kopieren**, dann **Mitteilung anzeigen**.

### So benutzt du es

- **TikTok:** Video → Teilen-Pfeil → ggf. **Mehr** → **Rezept speichern**
- **Instagram:** Beschreibung mit „mehr“ aufklappen → Screenshot (bei langen Texten mehrere) → in Fotos auswählen → Teilen → **Rezept aus Screenshot**
- Dann: App öffnen → **Geteiltes Rezept einfügen** → „Einfügen“ bestätigen → prüfen → **Speichern**

## Einkaufsliste und Preise

- Im Rezept die **Portionen** mit − / + einstellen und **Auf die Einkaufsliste** tippen – oder oben auf das **Wagen-Symbol**.
- Gleiche Zutaten aus mehreren Rezepten werden zusammengezählt. Salz, Öl, Gewürze & Co. stehen unter „Hast du wahrscheinlich daheim“.
- **Günstigste Mischung** zeigt jede Zutat beim billigsten Laden; tippst du auf einen Laden, siehst du alles dort.
- Die Preise kommen jeden Morgen automatisch von **heisse-preise.io**, einem Open-Source-Preisvergleich für österreichische Supermärkte. Es sind Richtwerte; die Zuordnung Produkt ↔ Zutat passiert über den Produktnamen. Prüfen kannst du sie unter https://k4rim1.github.io/karims-rezepte/preise-check.txt
- Bei Lidl und Penny enthalten die Daten oft nur Aktionen – dort fehlen eher Artikel.

## Wartung

- **Preise veraltet?** Auf GitHub im Repository **Actions → Kochbuch veröffentlichen → Run workflow**. GitHub pausiert tägliche Abläufe, wenn im Repository längere Zeit nichts passiert.
- **Backup:** In der App unter Hilfe & Backup → **Backup speichern** (z. B. in iCloud Drive). Wenn du die App vom Home-Bildschirm löschst, sind auch die Rezepte weg.
- **Am PC:** Adresse in Chrome oder Edge öffnen → in der Adressleiste **App installieren**. Rezepte überträgst du mit Backup speichern / laden.
- Öffentlich ist nur der App-Code in diesem Repository. Rezepte und Einkaufslisten liegen nur auf deinem Gerät.

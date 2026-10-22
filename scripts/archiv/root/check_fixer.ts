import fs from 'fs';
import path from 'path';

const toReplace: Record<string, string> = {
  'https://de.wikipedia.org/wiki/Bauabfall': 'https://de.wikipedia.org/wiki/Bauschutt',
  'https://de.wikipedia.org/wiki/Aufgaben': '', // Delete it
  'https://de.wikipedia.org/wiki/WU-Richtlinie': 'https://de.wikipedia.org/wiki/Wei%C3%9Fe_Wanne',
  'https://de.wikipedia.org/wiki/BitumenVersuche': '', // Delete it
  'https://de.wikipedia.org/wiki/Konsolidierung_(Bodenmechanik)': 'https://de.wikipedia.org/wiki/Konsolidation_(Bodenmechanik)',
  'https://de.wikipedia.org/wiki/Atterberg-Grenzen': '',
  'https://de.wikipedia.org/wiki/EModul': 'https://de.wikipedia.org/wiki/Elastizit%C3%A4tsmodul',
  'https://de.wikipedia.org/wiki/DaemmungVergleich': '', // Delete it
  'https://de.wikipedia.org/wiki/Umweltproduktdeklaration': 'https://de.wikipedia.org/wiki/Environmental_Product_Declaration',
  'https://de.wikipedia.org/wiki/Frischbetontemperatur': '', // Delete it
  'https://de.wikipedia.org/wiki/Festigkeitsberechnungen': '', // Delete it
  'https://de.wikipedia.org/wiki/FestbetonStatistik': '', // Delete it
  'https://de.wikipedia.org/wiki/HistorischeMaterialkennwerte': '', // Delete it
  'https://de.wikipedia.org/wiki/Karbonatisierung_(Beton)': 'https://de.wikipedia.org/wiki/Karbonatisierung',
  'https://de.wikipedia.org/wiki/InnovativeWerkstoffe': '', // Delete it
  'https://de.wikipedia.org/wiki/Informationsquellen': '', // Delete it
  'https://de.wikipedia.org/wiki/Knicken': 'https://de.wikipedia.org/wiki/Knicken',
  'https://de.wikipedia.org/wiki/Lebensdauern': 'https://de.wikipedia.org/wiki/Lebensdauer_(Technik)',
  'https://de.wikipedia.org/wiki/Materialdatenbanken': 'https://de.wikipedia.org/wiki/Werkstoffdatenbank',
  'https://de.wikipedia.org/wiki/Nachbehandlung': '', // Delete it
  'https://de.wikipedia.org/wiki/Stoffraumrechnung': '', // Delete it
  'https://de.wikipedia.org/wiki/Materialmodelle': '', // Delete it
  'https://de.wikipedia.org/wiki/Materialkennwerte': 'https://de.wikipedia.org/wiki/Werkstoffeigenschaft',
  'https://de.wikipedia.org/wiki/Praxisbeispiele': '', // Delete it
  'https://de.wikipedia.org/wiki/Rissbreite': '', // Delete it
  'https://de.wikipedia.org/wiki/Phasenwechselmaterial': 'https://de.wikipedia.org/wiki/Latentw%C3%A4rmespeicher',
  'https://de.wikipedia.org/wiki/SpannungDehnung': 'https://de.wikipedia.org/wiki/Spannungs-Dehnungs-Diagramm',
  'https://de.wikipedia.org/wiki/Erm%C3%BCdung_(Werkstoff)': 'https://de.wikipedia.org/wiki/Materialerm%C3%BCdung',
  'https://de.wikipedia.org/wiki/Stuetzenbemessung': '', // Delete it
  'https://de.wikipedia.org/wiki/Verankerungslaenge': '', // Delete it
  'https://de.wikipedia.org/wiki/Waermeeigenschaften': '', // Delete it
  'https://de.wikipedia.org/wiki/VDI6200': 'https://de.wikipedia.org/wiki/VDI-Richtlinie',
}

const dir = 'src/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  for (const [oldUrl, newUrl] of Object.entries(toReplace)) {
    if (content.includes(oldUrl)) {
      if (newUrl === '') {
        // remove the entire object { title: '...', url: '...' }
        // regex to match `{ title: '...', url: 'oldUrl' }` and optionally trailing comma
        const escapedOld = oldUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const pattern = new RegExp(`\\{\\s*title:\\s*'[^']+',\\s*url:\\s*'${escapedOld}'\\s*\\},?`, 'g');
        content = content.replace(pattern, '');
      } else {
        content = content.replace(oldUrl, newUrl);
      }
      changed = true;
    }
  }

  // clean up empty objects or trailing commas left behind in the array if any
  if (changed) {
    // e.g. [, ] -> []
    content = content.replace(/wikipedia=\{\s*\[\s*,?\s*\]\s*\}/g, 'wikipedia={[]}');
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/\[\s*,/g, '[');
    content = content.replace(/,\s*\]/g, ']');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
}

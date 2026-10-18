# Modulspezifikation & Styleguide: Baustoff- & Werkstoffmodule

Dieses Dokument dient als Master-Spezifikation, Architekturvorreiter und Design-System für alle Fachlernmodule der Baustoffkunde und Bauchemie. Um ein didaktisch geschlossenes, visuell konsistentes und fehlerfreies Nutzererlebnis über die gesamte Anwendung hinweg sicherzustellen, müssen alle neu implementierten oder überarbeiteten Module exakt nach den hier definierten Mustern aufgebaut sein.

Als **Gold Standard** und strukturelle Referenz dient das Modul **Baustoffe > Kalk (`Kalk.tsx`)**.

---

## 1. Architektur & Struktureller Aufbau

Jedes Fachmodul ist als funktionale React-Komponente unter Verwendung von TypeScript aufgebaut. Die Struktur teilt sich in vier logische Ebenen:

### A. Zustandsverwaltung (Tabs)
Das Modul darf keine unendliche Scroll-Page sein. Es muss Informationen mittels eines Zustandswählers (`activeTab`) in thematische Blöcke kapseln:
*   **Standard-Tabs:**
    *   `steckbrief`: Baustoff-Steckbrief (lädt die standardisierte Profildatenbank).
    *   `grundlagen`: Allgemeines Verständnis (z. B. chemische Kreisläufe, Entstehung).
    *   `festigkeit`: Erhärtungsprozesse, Verfestigungsmechanismen, Dauerhaftigkeit.
    *   `bestaendigkeit` o.ä.: Normative Vorgaben, Umwelteinflüsse, Schutzmaßnahmen.
*   **Wichtige Implementierung:** Tabs werden über flache, horizontal scrollbare oder umbrechende Button-Leisten gerendert.

### B. Header & Einleitung
Jedes Modul beginnt mit einer markanten Überschrift und einer einleitenden Teaser-Box:
```tsx
<div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
  <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
    <Box className="text-shiraz" /> Kalk
  </h2>
  <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
    <p>
      Baukalk ist einer der ältesten mineralischen Bindemittel. Er härtet durch Karbonatisierung an der Luft aus und verleiht Putz- und Mauermörteln eine hervorragende Verarbeitbarkeit.
    </p>
  </div>
```

### C. Steckbrief-Einbindung (`BaustoffProfil`)
Das Steckbrief-Tab delegiert die tabellarischen physikalischen/chemischen Kenndaten an die zentrale Profilkomponente:
```tsx
{activeTab === 'steckbrief' && (
  <div className="animate-in fade-in duration-300">
    <BaustoffProfil materialKey="kalk" />
  </div>
)}
```

### D. Standardisierter Footer (`ModuleFooter`)
Jedes Modul schließt zwingend mit der `ModuleFooter`-Komponente ab. Sie führt Wikipedia-Referenzen, normenbasiertes Fachschrifttum, Gesetze/Regelwerke und eine dynamische Formelsammlung zusammen:
```tsx
<ModuleFooter 
  wikipedia={[
    { title: 'Kalk', url: 'https://de.wikipedia.org/wiki/Kalk' },
    ...
  ]}
  literatur={[
    'Wendehorst Baustoffkunde: Grundlagen, Baustoffe und Werkstoffprüfung (37. Auflage, Springer Vieweg)',
    ...
  ]}
  regelwerke={[
    { title: 'DIN EN 459-1 (Baukalk - Teil 1: Definitionen, Anforderungen und Konformitätskriterien)', url: 'https://www.beuth.de/' }
  ]}
  formeln={
    activeTab === 'grundlagen'
      ? [
          {
            formel: 'CaCO_3 \\xrightarrow{\\approx 900-1100^{\\circ}\\text{C}} CaO + CO_2 \\uparrow',
            erklaerung: 'Thermische Zersetzung (Kalzinieren) von Calciumcarbonat (Kalkstein) zu Calciumoxid (Branntkalk) unter Abspaltung von Kohlendioxid. Die Reaktion ist stark endotherm.',
            quelle: 'DIN EN 459'
          }
        ]
      : []
  }
/>
```

---

## 2. Formatierung & Physikalisch-Chemische Präzision

Zur Vermittlung tiefer fachtechnischer Kompetenzen müssen chemische und mechanische Vorgänge formelmäßig exakt beschrieben werden:

1.  **Formel-Rendering:** Es wird ausnahmslos LaTeX über `react-katex` verwendet.
    *   Fließtext-Formeln: `<InlineMath math="CaSO_4" />`
    *   Freigestellte Formelblöcke: `<BlockMath math="CaO + H_2O \rightarrow Ca(OH)_2 + W\ddot{a}rme" />`
2.  **Klarstellungen & Reaktionsbedingungen:** Reaktionspfeile sollten, falls zutreffend, die physikalischen Randbedingungen (z. B. Brenntemperaturen über `\xrightarrow{\approx 900-1100^{\\circ}\text{C}}`) oder gasförmige Phasenübergänge (`\uparrow`) abbilden.
3.  **Gefügebeschreibungen:** Alle Hydratationsstufen, Phasenübergänge, mechanischen Vorgänge und Verbundwirkungen müssen analytisch logisch gegliedert und didaktisch mit nummerierten Prozessschritten oder definierten Begriffsauszeichnungen (`<strong>`) erklärt werden.

---

## 3. Farbschema, Schriften & UI-Design-Richtlinien

Das Design muss einladend, hochgradig lesbar und professionell akademisch wirken. Dunkle, immersive Kontraste ("schwarze Konsolenhintergründe") sind in diesen Modulen unerwünscht. 

### A. Farbpalette (Modulspezifisches Tagging)
Jedes Baustoffmodul erhält ein einheitliches Farb-Highlight, das sich durch Symbole (Lucide Icons) und aktive Zustandselemente hindurchzieht:
*   **Baukalk-Highlight:** `shiraz` (ein sattes, augenfreundliches Edel-Weinrot).
*   **Betontechnologie-Highlight:** Je nach Kontext, oft gedecktes Schiefergrau oder Grünblau.
*   **Nachhaltigkeit-Highlight (Sustainability):** `shiraz` (ein sattes, augenfreundliches Edel-Weinrot) für sämtliche interaktiven Buttons, Tabs und aktive Akzentflächen.
*   *Grundsätzliche Regel:* Verwende gedämpfte, edle Farben als Akzente statt greller Neonfarben.

### B. Element-Farbbelegungen (Tailwind CSS)
*   **Hauptcontainer:** `bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30`
    *   *Verboten:* Harte Ecken, dominante Schlagschatten, rein schwarze oder bunte Containerhintergründe.
*   **Hintergrund für Lern- & Infoboxen (Unterstützender Inhalt):** `bg-off-white` oder `bg-slate-50/50`.
*   **Innere Abteilungen / Tabellenhintergründe:** `bg-off-white` oder helle Erdtöne wie das weiche Pergamentweiß `bg-[#fcf8f2]` für historische oder bauchemische Einzelschritte.
*   **Rahmenelemente:** Dünne, feine Säume zur Strukturierung: `border border-home-grau/30`, `border-home-grau/20`, oder `border-slate-150`.
*   **Schriftfarbe (Klarer Kontrast):**
    *   Prägnante Titel & Überschriften: `text-text-main`
    *   Standard-Textkörper: `text-text-main/80` (mindert die visuelle Ermüdung im Vergleich zu reinem Schwarz)
    *   Zusatzmaterial / Fußnoten: `text-text-main/70` oder `text-slate-500`

### C. Abmessungen & Klick-Flächen (Haptik)
*   **Eckenrundung:** Konsistent `rounded-2xl` für größere Karten, `rounded-xl` oder `rounded-lg` für Buttons und Formelcontainer.
*   **Buttons:** Mindestabstand und -größe für Barrierefreiheit und mobile Touch-Nutzung. Ein Standard-Tab-Button besitzt die Klasse `px-4 py-2.5 rounded-xl font-bold text-sm transition-all`.
*   **Hover-Effekte:** Jeder interaktive Button muss sanft animiert sein (`transition-all` oder `duration-200 / duration-300`) und bei Cursor-Berührung ein direktes Feedback geben (z. B. `hover:bg-off-white`).

---

## 4. Beispiel-Kompilation einer standardkonformen Code-Schnittstelle

Eine saubere Modul-Schnittstelle, die diesen Styleguide erfüllt, zeichnet sich durch die folgende minimalistische Code-Ordnung aus:

```tsx
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { Box, Layers, Activity, BookOpen } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';

export default function Beispielfach() {
  const [activeTab, setActiveTab] = useState<'steckbrief' | 'theorie'>('steckbrief');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Box className="text-shiraz" /> Modulname
        </h2>
        
        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 mb-6">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'steckbrief' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('steckbrief')}
          >
            <BookOpen size={16} /> Steckbrief
          </button>
        </div>

        {/* Dynamic Tab Content rendering ... */}
      </div>

      {/* Footer-Integration */}
      <ModuleFooter 
        wikipedia={[{ title: 'Fachbereich', url: 'https://de.wikipedia.org/' }]}
        literatur={['Fachliteratur-Quelle 1']}
        regelwerke={[{ title: 'Regelwerk DIN 1234', url: 'https://...' }]}
        formeln={[]}
      />
    </div>
  );
}
```

import fs from 'fs';
import path from 'path';

const dict: Record<string, string> = {
  "Feuchtigkeitsklasse": "Einteilung nach Feuchtebelastung und Alkalizufuhr (WO bis WS).",
  "Alkaliempfindlichkeit (Gestein)": "Klassifizierung der Gesteinskörnung nach ihrer Reaktivität (E1 bis E3).",
  "Bitumengehalt": "Massenanteil des Bitumens im Asphaltgemisch.",
  "Hohlraumgehalt": "Volumenanteil der luftgefüllten Hohlräume im verdichteten Material.",
  "Dichte Gestein": "Rohdichte der verwendeten Gesteinskörnung.",
  "Dichte Bitumen": "Rohdichte des verwendeten Bitumens.",
  "Material": "Auswahl des zu untersuchenden Werkstoffs.",
  "Dicke d (m)": "Dicke der Bauteilschicht in Metern.",
  "Stützweite / Länge (l)": "Abstand zwischen den Auflagern oder Gesamtlänge des Bauteils.",
  "Gleichlast (q)": "Gleichmäßig verteilte Streckenlast auf dem Bauteil.",
  "Einzellast (F)": "Punktuell einwirkende Kraft auf das Bauteil.",
  "Position Einzellast (a)": "Abstand der Einzellast vom linken Auflager.",
  "Statisches System": "Art der Lagerung des Trägers (z.B. Einfeldträger, Kragarm).",
  "Zugfestigkeit ftk": "Charakteristische Zugfestigkeit des Materials.",
  "Teilsicherheitsbeiwert γFRP": "Sicherheitsbeiwert für den Faserverbundwerkstoff.",
  "Bewehrungsart": "Art der verwendeten Bewehrung (z.B. Betonstahl, Carbon).",
  "Entwässerung": "Art der Wasserableitung vom Bauteil.",
  "Branddauer t": "Dauer der Brandeinwirkung in Minuten.",
  "Breite b": "Breite des Bauteilquerschnitts.",
  "Höhe h": "Höhe des Bauteilquerschnitts.",
  "Bauteildicke (h)": "Dicke des betrachteten Bauteils.",
  "Betondeckung (c)": "Abstand zwischen Betonoberfläche und Bewehrungsstahl.",
  "Charakt. Druckfestigkeit (fck)": "Charakteristische Zylinderdruckfestigkeit des Betons nach 28 Tagen.",
  "E-Modul Gesteinskörnung (E_G)": "Elastizitätsmodul der Gesteinskörnung.",
  "E-Modul Zementstein (E_M)": "Elastizitätsmodul der Zementsteinmatrix.",
  "Volumenanteil Gestein (v_G)": "Anteil der Gesteinskörnung am Gesamtvolumen.",
  "Streckenenergie (Heat Input)": "Eingebrachte Wärmeenergie pro Längeneinheit beim Schweißen.",
  "Blechdicke t": "Dicke des zu schweißenden Blechs.",
  "Bauteildicke d": "Dicke des Bauteils.",
  "Stahlgüte (Fließgrenze)": "Klassifizierung des Stahls nach seiner Streckgrenze.",
  "Profiltyp": "Art des Stahlprofils (z.B. I-Profil, Hohlprofil).",
  "Faservolumengehalt v_f": "Volumenanteil der Fasern im Verbundwerkstoff.",
  "Faserart": "Art der verwendeten Verstärkungsfasern.",
  "Matrixart": "Art des verwendeten Matrixmaterials (Kunstharz).",
  "Wasserzementwert (w/z)": "Massenverhältnis von wirksamem Wasser zu Zement.",
  "Betonalter (t)": "Alter des Betons in Tagen seit der Herstellung.",
  "Zementfestigkeitsklasse": "Normfestigkeit des Zements nach 28 Tagen.",
  "Zementklasse": "Klassifizierung der Festigkeitsentwicklung des Zements.",
  "Prüfgeometrie": "Form des Probekörpers (z.B. Zylinder, Würfel).",
  "Lagerungsbedingung": "Bedingungen während der Aushärtung (z.B. Wasser, Luft).",
  "Kantenlänge a": "Länge der Kante des Probekörpers.",
  "Steiggeschwindigkeit (v)": "Geschwindigkeit, mit der der Beton in die Schalung steigt.",
  "Erstarrungszeit (t_E)": "Zeit bis zum Beginn des Erstarrens des Betons.",
  "Frischbetonrohdichte (γ)": "Dichte des noch nicht erstarrten Betons.",
  "Konsistenzklasse": "Maß für die Verarbeitbarkeit des Frischbetons.",
  "Masse (m_z)": "Masse des Zements.",
  "Temperatur (T_z)": "Temperatur des Zements.",
  "Zugabewasser flüssig (m_w)": "Masse des flüssig zugegebenen Wassers.",
  "Temperatur Wasser (T_w)": "Temperatur des Zugabewassers.",
  "Scherbeneis (m_eis)": "Masse des zugegebenen Eises zur Kühlung.",
  "Masse (m_g)": "Masse der Gesteinskörnung.",
  "Temperatur (T_g)": "Temperatur der Gesteinskörnung.",
  "w/z-Wert": "Massenverhältnis von Wasser zu Zement.",
  "Luftporengehalt (LP)": "Volumenanteil der künstlich eingeführten Luftporen.",
  "Sättigungsgrad (Wasser)": "Anteil der Poren, die mit Wasser gefüllt sind.",
  "Scheibenfläche A": "Fläche der betrachteten Glasscheibe.",
  "Weibull-Modul m": "Parameter für die Streuung der Festigkeit bei spröden Werkstoffen.",
  "Temperatur": "Aktuelle Temperatur des Bauteils oder der Umgebung.",
  "Glasart": "Art des verwendeten Glases (z.B. Floatglas, ESG).",
  "Lasteinwirkungsdauer": "Dauer, über die die Last auf das Bauteil einwirkt.",
  "Einbaufeuchte (u_start)": "Holzfeuchte zum Zeitpunkt des Einbaus.",
  "Relative Luftfeuchte": "Relative Feuchtigkeit der Umgebungsluft.",
  "Lagerdauer": "Dauer der Lagerung des Materials.",
  "Dicke (R)": "Radius oder halbe Dicke des Bauteils.",
  "Länge (L)": "Länge des Bauteils.",
  "Exzentrizität (Abstand zur Markröhre)": "Abstand des Schnittholzes vom Zentrum des Baumstamms.",
  "Skalierungsfaktor (Darstellung)": "Faktor zur visuellen Vergrößerung von Verformungen.",
  "Faserwinkel α (Druck)": "Winkel zwischen Kraftrichtung und Faserrichtung.",
  "Holzprodukt / Holzart": "Art des verwendeten Holzes oder Holzwerkstoffs.",
  "Querschnitt": "Abmessungen des Bauteilquerschnitts.",
  "Sortierklasse / Festigkeitsklasse": "Klassifizierung des Holzes nach seiner Tragfähigkeit.",
  "Nutzungsklasse (NKL)": "Einteilung nach den klimatischen Umgebungsbedingungen.",
  "Klasse der Lasteinwirkungsdauer (KLED)": "Einteilung der Lasten nach ihrer Einwirkungsdauer.",
  "Auflagerbedingung (k_c,90)": "Beiwert zur Berücksichtigung der Auflagerart bei Querdruck.",
  "Zusatzstoff Menge": "Menge des zugegebenen Zusatzstoffs.",
  "Zementgehalt (z)": "Masse des Zements pro Kubikmeter Beton.",
  "Umgebungstemperatur (T_c)": "Temperatur der umgebenden Luft.",
  "Bauteildicke (Massigkeit)": "Dicke des Bauteils, relevant für die Wärmeentwicklung.",
  "Erforderliche Ausschalfestigkeit": "Mindestdruckfestigkeit, die zum Ausschalen erreicht sein muss.",
  "Zementart": "Art des verwendeten Zements (z.B. CEM I, CEM II).",
  "Festigkeitsklasse": "Normfestigkeit des Materials.",
  "Erhärtung": "Geschwindigkeit der Festigkeitsentwicklung.",
  "Zusatzstoff": "Art des verwendeten Betonzusatzstoffs.",
  "Euler-Fall (Lagerungsbedingungen)": "Art der Lagerung an den Enden des Druckstabs.",
  "Expositionszeit (t)": "Dauer der Aussetzung gegenüber Umwelteinflüssen.",
  "Alterungsexponent (a)": "Parameter zur Beschreibung der zeitlichen Entwicklung.",
  "Betrachtungszeitpunkt (t)": "Zeitpunkt, für den die Berechnung durchgeführt wird.",
  "Karbonatisierungsgeschwindigkeit (K)": "Maß für das Fortschreiten der Karbonatisierungsfront.",
  "Prüfdauer (t)": "Dauer des Versuchs oder der Prüfung.",
  "CO2-Konzentration (Kammer)": "CO2-Gehalt in der Prüfkammer.",
  "Natürliche CO2-Konzentration": "CO2-Gehalt in der natürlichen Umgebung.",
  "Zirkuläre Materialverwendung (Input)": "Anteil an wiederverwendeten oder recycelten Materialien beim Bau.",
  "Nachnutzungspotenzial (Output)": "Anteil der Materialien, die nach dem Rückbau wiederverwendet werden können.",
  "Sekundärmaterialanteil (Input)": "Anteil an recycelten Rohstoffen im Material.",
  "Recyclingquote (Output)": "Anteil des Materials, der am Lebensende recycelt wird.",
  "Geplante Lebensdauer": "Vorgesehene Nutzungsdauer des Bauwerks in Jahren.",
  "Branchen-Durchschnitt": "Vergleichswert für die jeweilige Branche.",
  "Holzart / Werkstoff": "Auswahl des Holzes oder Holzwerkstoffs.",
  "Spannstahlklasse (Relaxationsverhalten)": "Klassifizierung des Spannstahls nach seinem Spannungsverlust.",
  "Kunststoff-Struktur": "Molekularer Aufbau des Kunststoffs (z.B. amorph, teilkristallin).",
  "Betrachtungszeitraum des Gebäudes (Jahre)": "Zeitraum für die Lebenszyklusanalyse.",
  "Tonanteil (Bindemittel)": "Anteil an Ton im Lehmgemisch.",
  "Schluffanteil": "Anteil an Schluff im Lehmgemisch.",
  "Sand/Kies-Anteil": "Anteil an Sand und Kies im Lehmgemisch.",
  "Herstellfeuchte (Wassergehalt)": "Wassergehalt bei der Herstellung des Lehms.",
  "Material 1": "Erstes zu vergleichendes Material.",
  "Material 2": "Zweites zu vergleichendes Material.",
  "Material 3 (Optional)": "Drittes zu vergleichendes Material.",
  "Steinart": "Art des Mauersteins.",
  "Mörtelart": "Art des verwendeten Mauermörtels.",
  "Verbandsart": "Art des Mauerwerksverbands.",
  "Lufttemperatur (T_a)": "Temperatur der Umgebungsluft.",
  "Betontemperatur (T_c)": "Temperatur des Frischbetons.",
  "Relative Luftfeuchte (r)": "Relative Luftfeuchtigkeit der Umgebung.",
  "Windgeschwindigkeit (V)": "Geschwindigkeit des Windes an der Betonoberfläche.",
  "Masse [kg]": "Masse des Materials in Kilogramm.",
  "Transport [km]": "Transportentfernung in Kilometern.",
  "Zement": "Menge des Zements.",
  "Zusatzstoff (z.B. Kalksteinmehl)": "Menge an inerten oder puzzolanischen Zusatzstoffen.",
  "Sand (0/2 mm)": "Menge der feinen Gesteinskörnung.",
  "Kies (2/8 mm)": "Menge der groben Gesteinskörnung.",
  "Feststoffvolumen im Beton": "Volumenanteil aller festen Bestandteile im Beton.",
  "Kornform der Gesteinskörnung": "Form der Gesteinskörner (z.B. gedrungen, plattig).",
  "Material-Voreinstellung": "Vordefinierte Materialkombination.",
  "Zementgehalt": "Menge des Zements pro Kubikmeter.",
  "Frischbetontemperatur": "Temperatur des Betons beim Einbau.",
  "Umgebungstemperatur": "Temperatur der Umgebung.",
  "Basisjahr:": "Referenzjahr für die Preisentwicklung.",
  "Austauschrate (RC-Anteil)": "Anteil der rezyklierten Gesteinskörnung am Gesamtzuschlag.",
  "Art der RC-Körnung": "Herkunft der rezyklierten Gesteinskörnung (z.B. Betonbrechsand).",
  "Rheologisches Modell": "Modell zur Beschreibung des Fließverhaltens.",
  "Spannungs-Zeit-Modell": "Modell zur Beschreibung des zeitabhängigen Spannungsverlaufs.",
  "Bauteilbreite (b)": "Breite des Bauteils.",
  "Querschnittshöhe (h)": "Höhe des Bauteilquerschnitts.",
  "Querschnittsbreite (b)": "Breite des Bauteilquerschnitts.",
  "Betonfestigkeitsklasse": "Klassifizierung des Betons nach seiner Druckfestigkeit.",
  "Bewehrungsgüte": "Festigkeitsklasse des Bewehrungsstahls.",
  "Stahlsorte": "Güteklasse des verwendeten Stahls.",
  "Korrosivitätskategorie": "Einteilung der Umgebungsbedingungen hinsichtlich der Korrosionsbelastung.",
  "Neigung m (N ≤ 5·10^6)": "Neigung der Wöhlerlinie für die Ermüdungsfestigkeit.",
  "Zementgehalt z": "Masse des Zements pro Kubikmeter Beton.",
  "Flugasche (FA)": "Menge an zugegebener Flugasche.",
  "k-Wert FA": "Anrechenbarkeitsfaktor für Flugasche auf den Wasserzementwert.",
  "Silikastaub (SF)": "Menge an zugegebenem Silikastaub.",
  "k-Wert SF": "Anrechenbarkeitsfaktor für Silikastaub auf den Wasserzementwert.",
  "Hüttensand (KSM)": "Menge an zugegebenem Hüttensandmehl.",
  "k-Wert KSM": "Anrechenbarkeitsfaktor für Hüttensand auf den Wasserzementwert.",
  "Pflanzenkohle (Biochar)": "Menge an zugegebener Pflanzenkohle.",
  "k-Wert Biochar": "Anrechenbarkeitsfaktor für Pflanzenkohle.",
  "Gesamtfeuchte Biochar": "Gesamter Wassergehalt der Pflanzenkohle.",
  "Wasserbedarf (WA) Biochar": "Wassermenge, die von der Pflanzenkohle absorbiert wird.",
  "Zusatzmittel (FM/LP)": "Menge an Fließmittel oder Luftporenbildner.",
  "Luftporengehalt": "Volumenanteil der Luftporen im Beton.",
  "Rohdichte Gestein": "Dichte der Gesteinskörnung.",
  "Gesamtfeuchte": "Gesamter Wassergehalt der Gesteinskörnung.",
  "Kernfeuchte (WA)": "Wasseraufnahme der Gesteinskörnung bis zur Sättigung.",
  "Fraktion 8/16": "Anteil der Gesteinskörnung mit Korngröße 8 bis 16 mm.",
  "Fraktion 16/32": "Anteil der Gesteinskörnung mit Korngröße 16 bis 32 mm.",
  "Bauteil-Voreinstellung": "Vordefinierte Parameter für typische Bauteile.",
  "Wasseranspruch": "Benötigte Wassermenge für eine bestimmte Konsistenz.",
  "Ziel-Druckfestigkeit (Beton)": "Angestrebte Druckfestigkeit des Betons nach 28 Tagen.",
  "Größtkorn (Dmax)": "Maximaler Korndurchmesser der Gesteinskörnung.",
  "Kornform": "Form der Gesteinskörner.",
  "Sandfraktion": "Anteil der feinen Gesteinskörnung.",
  "Wasserdruckhöhe h_w": "Höhe der anstehenden Wassersäule.",
  "Bauteildicke h": "Dicke des wasserundurchlässigen Bauteils.",
  "Geplante Rissbreite w_cal": "Zulässige Rissbreite für die Bemessung.",
  "Dicke der Tragschicht": "Dicke der lastverteilenden Schicht.",
  "Betondeckung": "Abstand zwischen Betonoberfläche und Bewehrung.",
  "Stabdurchmesser": "Durchmesser der Bewehrungsstäbe.",
  "Laufzeit (Echo)": "Zeit, die das Schallsignal für den Hin- und Rückweg benötigt.",
  "Gemessenes Potential": "Elektrisches Potential zur Erkennung von Korrosion.",
  "Resonanzfrequenz (f)": "Frequenz, bei der das Bauteil in Resonanz schwingt.",
  "Wellengeschwindigkeit (v)": "Ausbreitungsgeschwindigkeit der Wellen im Material.",
  "Strahlungsenergie": "Energie der verwendeten Strahlung (z.B. Röntgen).",
  "Prüfrichtung (Winkel)": "Winkel der zerstörungsfreien Prüfung.",
  "Festhaltungsgrad R": "Maß für die Behinderung der Verformung des Bauteils."
};

function getExplanation(label: string): string {
  // Try exact match
  if (dict[label]) return dict[label];
  
  // Try partial match
  for (const [key, value] of Object.entries(dict)) {
    if (label.includes(key) || key.includes(label)) {
      return value;
    }
  }
  
  // Fallback
  return "Parameter zur Anpassung der Berechnung.";
}

const dir = 'src/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // 1. Add info prop to <Slider ... />
  // Regex matches <Slider ... label="Label" ... /> and adds info="Explanation" if not present
  content = content.replace(/<Slider([^>]*?)label=([\"'{])([^\"'}]+)([\"'}])([^>]*?)\/?>/g, (match, p1, p2, label, p4, p5) => {
    if (match.includes('info=')) return match; // Already has info
    
    // Clean label if it's an expression
    let cleanLabel = label;
    if (p2 === '{' && label.startsWith('`') && label.endsWith('`')) {
      cleanLabel = label.substring(1, label.length - 1);
    }
    
    const explanation = getExplanation(cleanLabel);
    return `<Slider${p1}label=${p2}${label}${p4} info="${explanation}"${p5}/>`;
  });

  // 2. Add InfoTooltip to <label>...</label> that are followed by <select> or <input>
  // This is trickier. We find <label>...</label> and if it doesn't have InfoTooltip nearby, we wrap it.
  // A safer regex: find <label className="...">Text</label>
  content = content.replace(/<label([^>]*)>([^<]+)<\/label>/g, (match, p1, labelText) => {
    // If the label is already wrapped in a flex container with InfoTooltip, skip
    // But we can't easily check the parent with regex. We can check if the file already imports InfoTooltip.
    // Actually, let's just replace the label with a flex div containing the label and InfoTooltip.
    // We must ensure we don't double-wrap.
    
    const explanation = getExplanation(labelText.trim());
    return `<div className="flex items-center gap-2"><label${p1}>${labelText}</label><InfoTooltip text="${explanation}" /></div>`;
  });

  // If we added InfoTooltip, we need to import it
  if (content.includes('<InfoTooltip') && !content.includes('InfoTooltip"')) {
    // Add import after the last import
    const importMatch = content.match(/import.*?;/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, `${lastImport}\nimport { InfoTooltip } from '@/src/components/ui/InfoTooltip';`);
    } else {
      content = `import { InfoTooltip } from '@/src/components/ui/InfoTooltip';\n${content}`;
    }
  }

  if (content !== fs.readFileSync(filePath, 'utf-8')) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});

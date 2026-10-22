const fs = require('fs');

let content = fs.readFileSync('src/modules/Zertifizierung.tsx', 'utf-8');

// 1. Remove Schematische Darstellung
const schemaStart = content.indexOf('{/* Schematische Darstellung */}');
const schemaEndText = '          </div>\n        </div>\n';
const schemaEnd = content.indexOf(schemaEndText, schemaStart) + schemaEndText.length;

if (schemaStart !== -1 && schemaEnd > schemaStart) {
    content = content.substring(0, schemaStart) + content.substring(schemaEnd);
}

// 2. Expand QNG Description
const newQNGDesc = "Das QNG (Qualitätssiegel Nachhaltiges Gebäude) ist das staatliche Gütesiegel des Bundesbauministeriums (BMWSB). Es bildet die verpflichtende Grundlage für die Bundesförderung für effiziente Gebäude (BEG) sowie für klimafreundliche Neubauten (KFN/WEF) durch die KfW. Das Siegel existiert in den Varianten PLUS und PREMIUM. QNG ist kein eigenständiges Zertifizierungssystem, sondern knüpft an bestehende Systeme (wie DGNB, BNB, NaWoh oder BiRN) an. Es definiert harte, nicht verhandelbare K.O.-Kriterien: Strenge Grenzwerte für Treibhausgasemissionen im Gebäudelebenszyklus (LCA), Vorgaben zur nachhaltigen Materialgewinnung (Holz), und strenge Anforderungen an die Schadstoffvermeidung in Bauprodukten (Schadstoffmatrix nach QNG).";

content = content.replace(
    /'Das QNG.*?nachgewiesen werden müssen\.'/,
    `'${newQNGDesc}'`
);

// 3. Expand QNG Beispielfall
const oldExample = `<h3 className="text-lg font-bold text-text-main border-b border-home-grau/20 pb-2">QNG (Qualitätssiegel Nachhaltiges Gebäude)</h3>
              <p className="text-sm text-text-main/80">
                Konkretes Beispiel: <strong>Einfamilienhaus (EFH)</strong>
              </p>
              <div className="text-sm text-text-main/80 space-y-4">
                <p>
                  Eine Familie baut ein neues Einfamilienhaus und möchte die zinsgünstigen KfW-Kredite (KFN) nutzen. Dafür ist das QNG-Siegel (PLUS oder PREMIUM) zwingend erforderlich.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Treibhausgasemissionen (LCA):</strong> Dies ist das absolute K.O.-Kriterium. Für QNG-PLUS darf das Haus max. 24 kg CO₂-Äqv./(m²a) über 50 Jahre emittieren (inkl. Betriebsenergie). Die Familie entscheidet sich für eine Holzständerbauweise und eine Wärmepumpe, um diesen Wert sicher zu erreichen.</li>
                  <li><strong>Schadstoffvermeidung:</strong> Es müssen strenge Anforderungen an die verwendeten Bauprodukte eingehalten werden (z.B. keine stark lösemittelhaltigen Kleber, Beschränkungen bei Bioziden in Farben). Dies muss durch Zertifikate (z.B. natureplus, Blauer Engel) oder Herstellererklärungen nachgewiesen werden.</li>
                  <li><strong>Nachhaltige Materialgewinnung:</strong> Das verbaute Holz muss aus nachhaltiger Forstwirtschaft stammen (FSC oder PEFC zertifiziert).</li>
                  <li><strong>Barrierefreiheit:</strong> Das Erdgeschoss muss barrierefrei zugänglich und nutzbar sein (z.B. bodengleiche Dusche, ausreichende Türbreiten).</li>
                </ul>
                <div className="bg-shiraz/10 p-3 rounded-lg border border-shiraz/20 mt-2">
                  <strong>Fazit:</strong> Das QNG ist im Vergleich zur DGNB weniger "ganzheitlich", sondern fokussiert sich stark auf harte Grenzwerte bei CO₂-Emissionen und Schadstoffen als Bedingung für staatliche Fördergelder.
                </div>
              </div>`;

const newExample = `<h3 className="text-lg font-bold text-text-main border-b border-home-grau/20 pb-2">QNG (Qualitätssiegel Nachhaltiges Gebäude)</h3>
              <p className="text-sm text-text-main/80">
                Konkretes Beispiel: <strong>Wohngebäude (KfW Förderung)</strong>
              </p>
              <div className="text-sm text-text-main/80 space-y-4">
                <p>
                  Eine Bauherrengemeinschaft plant ein klimafreundliches Mehrfamilienhaus und beantragt zinsgünstige Kredite der KfW. Die volle Fördersumme gibt es nur mit dem QNG-Siegel.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Treibhausgasemissionen (LCA) nach QNG-Anhang 3:</strong> Dies ist das absolute K.O.-Kriterium. Für das Siegel QNG-PLUS darf das Haus maximal 24 kg CO₂-Äqv./(m²a) über den Lebenszyklus (50 Jahre, Herstellungs- und Betriebsphase) emittieren. QNG-PREMIUM erlaubt nur 20 kg CO₂-Äqv./(m²a). Um diese Werte zu erreichen, sind in der Regel Holz- oder Hybridbauweisen, stark CO₂-reduzierte Betone und eine energieeffiziente Wärmepumpentechnik zwingend.</li>
                  <li><strong>Schadstoffvermeidung nach QNG-Anhang 4:</strong> Hier wird es in der Ausführung oft kritisch: Es gelten strikte Vorgaben (Steckbrief 313) zur Begrenzung von SVHC (Besonders besorgniserregende Stoffe), Schwermetallen, Bioziden, Halogenen und VOCs. Das betrifft vor allem Ausbauprodukte: Farben, Lacke, Klebstoffe, Dichtstoffe, Bodenbeläge und Dämmstoffe. Die ausführenden Firmen müssen für jedes eingesetzte Produkt (z. B. den PU-Schaum oder Parkettkleber) über Sicherheitsdatenblätter und Herstellererklärungen lückenlos dokumentieren, dass die Grenzwerte nicht überschritten werden. Abweichungen auf der Baustelle ("es wurde schnell ein anderer Kleber aus dem Baumarkt geholt") gefährden sofort das Siegel!</li>
                  <li><strong>Nachhaltige Materialgewinnung:</strong> Nahezu das gesamte verbaute Holz (mind. 80 % für PLUS, mind. 90 % für PREMIUM) sowie holzbasierte Dämmstoffe müssen nachweislich aus nachhaltiger Waldbewirtschaftung stammend zertifiziert sein (PEFC, FSC). Eine geschlossene "Chain of Custody" (Lieferkettennachweis) bis zum Handwerker ist notwendig.</li>
                  <li><strong>Barrierefreiheit & Anpassbarkeit:</strong> Wohnungen müssen entsprechende Kriterien erfüllen (breite Türen, bodengleiche Duschen, ausreichende Bewegungsflächen), um eine flexible Nutzung in allen Lebensphasen zu ermöglichen.</li>
                </ul>
                <div className="bg-shiraz/10 p-3 rounded-lg border border-shiraz/20 mt-2">
                  <strong>Fazit zum QNG:</strong> Wer das QNG-Siegel anstrebt, muss extrem früh im Planungsprozess die CO₂-Bilanz optimieren (LCA). Die baubegleitende Dokumentation der Bauprodukte (Schadstoffvermeidung) stellt höchste Anforderungen an die Bauleitung und die ausführenden Betriebe, da jeder falsche Dichtschaum den Förderkredit kosten kann.
                </div>
              </div>`;

content = content.replace(oldExample, newExample);

fs.writeFileSync('src/modules/Zertifizierung.tsx', content, 'utf-8');

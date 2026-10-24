import React, { useState } from 'react';
import { Layers, Sparkles, Flame, Microscope, Droplets, ArrowRight } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { useTabContext } from '@/src/contexts/TabContext';
import { ExpositionsKurzkarte } from '@/src/components/ui/ExpositionsKurzkarte';
import { springeZu } from '@/src/components/ui/Querverweis';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

export default function Grundlagen() {
  const [activeTab, setActiveTab] = useState<'zement' | 'wasser' | 'gesteinskoernung' | 'zusatzstoffe' | 'mehlkorn'>('zement');
  const { setActiveTab: setModul } = useTabContext();
  // Themen mit eigener Quelle (AP 3.9): hier nur verlinkt
  const WEITER = [
    { ziel: 'bindemittel', label: 'Zementherstellung & Hydratation', modul: 'Bindemittel' },
    { ziel: 'frischbeton', label: 'Konsistenzklassen', modul: 'Frischbeton' },
    { ziel: 'festbeton', label: 'Druckfestigkeitsklassen', modul: 'Festbeton' },
    { ziel: 'expositionsklassen', label: 'Expositions- & Feuchtigkeitsklassen', modul: 'Expositionsklassen' },
    { ziel: 'regularien', label: 'Normen & Regelwerke', modul: 'Regulatives' },
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Layers className="text-shiraz" /> Ausgangsstoffe des Betons
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Beton besteht aus Zement, Zugabewasser und Gesteinskörnung, ergänzt um Zusatzstoffe und Zusatzmittel. Dieses Modul beschreibt die Ausgangsstoffe und ihre Kennwerte für den Mischungsentwurf; Festlegung, Eigenschaften und Konformität regeln DIN EN 206 und DIN 1045-2.
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <strong className="mr-1">Lernpfad:</strong>
            {([
              ['zement', 'Zement'], ['wasser', 'Zugabewasser'], ['gesteinskoernung', 'Gesteinskörnung'],
              ['zusatzstoffe', 'Zusätze'], ['mehlkorn', 'Mehlkorn'],
            ] as const).map(([id, label], i) => (
              <React.Fragment key={id}>
                {i > 0 && <span className="text-text-main/40">→</span>}
                <button onClick={() => setActiveTab(id)} className="underline decoration-dotted hover:text-shiraz cursor-pointer">{i + 1}. {label}</button>
              </React.Fragment>
            ))}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs" data-weiterfuehrend="grundlagen">
            <strong className="mr-1">Eigene Module:</strong>
            {WEITER.map(w => (
              <button key={w.ziel} onClick={() => springeZu(setModul, w.ziel)} title={`Zum Modul ${w.modul}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-home-grau/30 hover:border-shiraz hover:text-shiraz cursor-pointer">
                {w.label} <ArrowRight size={11} />
              </button>
            ))}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button aria-pressed={activeTab === 'zement'}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'zement' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-text-main'}`}
            onClick={() => setActiveTab('zement')}
          >
            Zementarten
          </button>
          <button aria-pressed={activeTab === 'wasser'}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'wasser' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-text-main'}`}
            onClick={() => setActiveTab('wasser')}
          >
            Zugabewasser
          </button>
          <button aria-pressed={activeTab === 'gesteinskoernung'}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'gesteinskoernung' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-text-main'}`}
            onClick={() => setActiveTab('gesteinskoernung')}
          >
            Gesteinskörnungen
          </button>
          <button aria-pressed={activeTab === 'mehlkorn'}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'mehlkorn' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-text-main'}`}
            onClick={() => setActiveTab('mehlkorn')}
          >
            Mehlkorngehalt
          </button>
          <button aria-pressed={activeTab === 'zusatzstoffe'}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'zusatzstoffe' ? 'bg-shiraz text-white shadow-md' : 'bg-off-white text-text-main border border-home-grau/30 hover:border-text-main'}`}
            onClick={() => setActiveTab('zusatzstoffe')}
          >
            Zusätze
          </button>
        </div>

        {activeTab === 'wasser' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <h3 className="text-lg font-bold flex items-center gap-2"><Droplets size={18} className="text-shiraz" /> Zugabewasser (DIN EN 1008)</h3>
            <p className="text-sm text-text-main/80">
              Das Zugabewasser löst die Hydratation des Zements aus und stellt zusammen mit der Oberflächenfeuchte der Gesteinskörnung den wirksamen Wassergehalt, auf den sich der w/z-Wert bezieht. Die Eignung von Wasser regelt DIN EN 1008; maßgebend sind vor allem Stoffe, die das Erstarren, die Festigkeitsentwicklung oder den Korrosionsschutz der Bewehrung beeinträchtigen.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-off-white text-left">
                    <th className="p-3 border border-home-grau/30">Wasserart</th>
                    <th className="p-3 border border-home-grau/30">Eignung nach DIN EN 1008</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-3 border border-home-grau/30 font-semibold">Trinkwasser</td><td className="p-3 border border-home-grau/30">Geeignet, eine Prüfung ist nicht erforderlich.</td></tr>
                  <tr><td className="p-3 border border-home-grau/30 font-semibold">Restwasser aus der Betonherstellung</td><td className="p-3 border border-home-grau/30">Geeignet, wenn die Anforderungen der Norm (u. a. Begrenzung des zusätzlichen Feststoffeintrags) eingehalten werden.</td></tr>
                  <tr><td className="p-3 border border-home-grau/30 font-semibold">Grundwasser, natürliches Oberflächenwasser, Brauchwasser aus der Industrie</td><td className="p-3 border border-home-grau/30">Kann geeignet sein; vor der Verwendung zu prüfen.</td></tr>
                  <tr><td className="p-3 border border-home-grau/30 font-semibold">Meerwasser, Brackwasser</td><td className="p-3 border border-home-grau/30">Allenfalls für unbewehrten Beton; für Stahl- und Spannbeton wegen der Chloride nicht geeignet.</td></tr>
                  <tr><td className="p-3 border border-home-grau/30 font-semibold">Häusliches Abwasser</td><td className="p-3 border border-home-grau/30">Nicht geeignet.</td></tr>
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2">Prüfmerkmale</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
                  <li><strong>Vorprüfung:</strong> Öle und Fette, Detergenzien, Farbe, Schwebstoffe, Geruch, Säuregehalt (pH-Wert) und Huminstoffe.</li>
                  <li><strong>Chemische Prüfung:</strong> Chlorid-, Sulfat- und Alkaligehalt sowie schädliche Verunreinigungen wie Zucker, Phosphate, Nitrate, Blei und Zink.</li>
                  <li><strong>Vergleichsprüfung:</strong> Erstarrungszeit und Druckfestigkeit gegenüber einer Mischung mit destilliertem bzw. Trinkwasser.</li>
                </ul>
              </div>
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2">Wirksamer Wassergehalt</h4>
                <p className="text-sm text-gray-700">
                  Für den w/z-Wert zählt das Zugabewasser zuzüglich des Oberflächenwassers der Gesteinskörnung (und des Wassers aus Zusatzmitteln). Das von der Gesteinskörnung aufgenommene Kernwasser zählt nicht dazu – poröse Körnungen (Leicht- oder RC-Gesteinskörnung) sind deshalb vorzunässen oder ihr Wasseranspruch ist bei der Zugabe zu berücksichtigen.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gesteinskoernung' && (
          <div className="flex flex-col gap-6 animate-fade-in">
             <h3 className="text-lg font-bold">Gesteinskörnungen für Beton (DIN EN 12620 / DIN 1045-2)</h3>
             <p className="text-sm text-text-main/80">
               Gesteinskörnungen machen ca. 70-80% des Betonvolumens aus und bilden das formstabile Gerüst (Kapitel 2 der Betontechnischen Daten).
             </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2">Begriffe & Kategorien</h4>
                <ul className="space-y-3 text-sm text-text-main/80">
                  <li><strong>Dmax (Größtkorn):</strong> Oberer Siebdurchgang. Typischerweise 8, 16 oder 32 mm. Beeinflusst den Mehlkorn- und Wasserbedarf (je größer das Korn, desto weniger Hohlraum und Oberfläche).</li>
                  <li><strong>Gesteinsarten:</strong> Natürliche (Sand, Kies), rezyklierte (RC-Beton) oder leichte Gesteinskörnungen (z.B. Blähton, Bims für Leichtbeton nach DIN EN 13055).</li>
                  <li><strong>Kornform:</strong> Kubisch ist ideal. Längliche, plattige Körner erhöhen den Wasseranspruch und verschlechtern die Verarbeitbarkeit.</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                <h4 className="font-bold text-shiraz mb-2">Alkalikieselsäurereaktion (AKR) / "Betonkrebs"</h4>
                <p className="text-sm text-text-main/80 mb-2">
                  Zusammentreffen von feuchter Umgebung (WF, WA, WS), reaktiver Kieselsäure in der Gesteinskörnung (z.B. Opalsandstein, gebrochener Flint) und hohen Alkalien aus dem Zement. 
                </p>
                <div className="text-xs bg-off-white p-2 rounded">
                  <strong>Vorbeugende Maßnahmen nach DAfStb-Richtlinie:</strong> <br/>
                  - Unbedenkliche Gesteinskörnung verwenden (Alkaliempfindlichkeitsklasse E I statt E III)<br/>
                  - NA-Zemente (niedriger wirksamer Alkaligehalt, DIN 1164-10) verwenden<br/>
                  - Alkalieintrag von außen unterbinden (z.B. hydrophobieren)<br/>
                  - Nutzung von Hüttensand (CEM III)
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm md:col-span-2">
                <h4 className="font-bold text-shiraz mb-2">Eigenschaften & Kennwerte</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-main/80">
                  <div>
                    <h5 className="font-bold mb-1">Sieblinien (z.B. A/B/C)</h5>
                    <p className="text-xs">
                      Ideale Kornzusammensetzung. Die <strong>Sieblinie A</strong> ist sehr grob, die <strong>Sieblinie C</strong> sehr fein. Der günstige Bereich (z.B. AB) liegt dazwischen. Ein kontinuierlicher Kornaufbau fördert die Festigkeit und Dichtigkeit.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">Wasseranspruch</h5>
                    <p className="text-xs">
                      Feinanteile und poröse Gesteinskörnungen saugen Wasser auf. Dies muss bei der w/z-Wert-Berechnung als <strong>Kernfeuchte</strong> berücksichtigt werden, ansonsten sinkt die wirksame Wassermenge (schlechte Verarbeitbarkeit).
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">Rezyklierte Körnungen</h5>
                    <p className="text-xs">
                      Dürfen nach DIN 1045-2:2023-08 (Typ 1/Typ 2) begrenzt beigemischt werden: z. B. X0–XC4, XF1, XF3 ≤ 45/35 Vol.-%, XA1 ≤ 25/25 Vol.-%, XD1/XD2/XS1/XS2/XF2/XF4 ≤ 30/20 Vol.-% der groben Gesteinskörnung; nicht in XA2, XA3, XM (MVV TB 2025/1). Problematisch ist oft der höhere Wasseranspruch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'zement' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <h3 className="text-lg font-bold">Zementarten nach DIN EN 197-1 / DIN EN 197-5</h3>
            <p className="text-sm text-text-main/80 mb-4">Übersicht der Hauptzementarten und ihrer wesentlichen Zusätze. Zement ist ein hydraulisches Bindemittel: Portlandzementklinker aus Kalkstein und Ton, fein gemahlen mit Gips bzw. Anhydrit als Erstarrungsregler und je nach Zementart weiteren Hauptbestandteilen. Herstellung, Klinkerphasen und Hydratation stehen im Modul{' '}
              <button onClick={() => springeZu(setModul, 'bindemittel')} className="underline decoration-dotted text-shiraz hover:text-shiraz/80 cursor-pointer">Bindemittel</button>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[
                 { typ: 'CEM I', name: 'Portlandzement', desc: 'Mindestens 95% Portlandzementklinker. Hohe Frühfestigkeit, hohe Wärmeentwicklung.' },
                 { typ: 'CEM II', name: 'Portlandkompositzement', desc: 'Klinker + Hüttensand (S), Flugasche (V/W), Kalkstein (LL) etc. (bis 35%). Umweltfreundlicher Standardzement im Hochbau.' },
                 { typ: 'CEM III', name: 'Hochofenzement', desc: 'Viel Hüttensand (36 - 95%). Geringe Wärmeentwicklung, hoher Widerstand gegen chemischen Angriff, sehr gut für Massenbeton.' },
                 { typ: 'CEM IV', name: 'Puzzolanzement', desc: 'Enthält Puzzolane oder Flugasche. Eher selten in DACH, genutzt für spezielle chemische Beständigkeiten.' },
                 { typ: 'CEM V', name: 'Kompositzement', desc: 'Klinker + Flugasche + Hüttensand. Umweltfreundlich, niedrige Hydratationswärme.' },
                 { typ: 'CEM VI', name: 'Kompositzement (DIN EN 197-5)', desc: 'Seit 2021 genormt (DIN EN 197-5) mit weiter reduziertem Klinkeranteil (hoher Anteil Hüttensand und Kalkstein) für minimalen CO2-Fußabdruck.' },
               ].map((c, i) => (
                 <div key={i} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm flex flex-col">
                   <div className="text-lg font-bold text-shiraz mb-1">{c.typ}</div>
                   <div className="font-medium text-sm mb-3 border-b pb-2">{c.name}</div>
                   <div className="text-sm text-text-main/70">{c.desc}</div>
                 </div>
               ))}
            </div>

            <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 mt-4">
              <h4 className="font-bold mb-2">Festigkeitsklassen (Zement)</h4>
              <p className="text-sm text-text-main/80">Die Normfestigkeit (nach 28 Tagen) wird in N/mm² angegeben. Zusätzlich wird die Anfangsfestigkeit klassifiziert:</p>
              <ul className="list-disc list-inside mt-2 text-sm text-text-main/70">
                <li><strong>32,5 / 42,5 / 52,5:</strong> Normfestigkeit</li>
                <li><strong>L (Low):</strong> Niedrige Anfangsfestigkeit (nur CEM III)</li>
                <li><strong>N (Normal):</strong> Normale Anfangsfestigkeit</li>
                <li><strong>R (Rapid):</strong> Hohe Anfangsfestigkeit</li>
              </ul>
              <div className="mt-3 text-xs text-text-main/50 font-mono bg-white p-2 border rounded">Beispiel: CEM II/A-LL 42,5 R (Portlandkalksteinzement, Normfestigkeit 42,5 N/mm², hohe Anfangsfestigkeit)</div>
            </div>
          </div>
        )}

        {activeTab === 'mehlkorn' && (
          <div className="flex flex-col gap-6 animate-fade-in">
             <h3 className="text-lg font-bold">Mehlkorngehalt</h3>
             <p className="text-sm text-text-main/80">
               Als Mehlkorn gelten alle festen Partikel im Beton, die kleiner oder gleich 0,125 mm sind (Zement, Zusatzstoffe, feinster Sand). 
               Ein korrekter Mehlkorngehalt ist essenziell für die Verarbeitbarkeit, das Wasserrückhaltevermögen (Pumpbarkeit) und die Dichtigkeit des Betons.
             </p>

             <div className="bg-white rounded-xl border border-home-grau/30 shadow-sm p-5">
               <h4 className="font-bold mb-4">Höchstzulässiger Mehlkorngehalt (DIN 1045-2, Tab. F.4.1 / F.4.2; Größtkorn 16–63 mm)</h4>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm border-collapse">
                   <thead>
                     <tr className="border-b-2 border-home-grau/30">
                       <th className="py-2 px-2">Anwendungsbereich</th>
                       <th className="py-2 px-2">Zementgehalt</th>
                       <th className="py-2 px-2">Max. Mehlkorngehalt [kg/m³]</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className="border-b border-home-grau/10">
                       <td className="py-2 px-2">XF, XM; bis C50/60 bzw. LC50/55</td>
                       <td className="py-2 px-2">≤ 300 kg/m³</td>
                       <td className="py-2 px-2 font-mono">400</td>
                     </tr>
                     <tr className="border-b border-home-grau/10">
                       <td className="py-2 px-2">XF, XM; bis C50/60 bzw. LC50/55</td>
                       <td className="py-2 px-2">≥ 350 kg/m³</td>
                       <td className="py-2 px-2 font-mono">450</td>
                     </tr>
                     <tr className="border-b border-home-grau/10">
                       <td className="py-2 px-2">Alle Expositionsklassen; ab C55/67 bzw. LC55/60</td>
                       <td className="py-2 px-2">≤ 400 kg/m³</td>
                       <td className="py-2 px-2 font-mono">500</td>
                     </tr>
                     <tr className="border-b border-home-grau/10">
                       <td className="py-2 px-2">Alle Expositionsklassen; ab C55/67 bzw. LC55/60</td>
                       <td className="py-2 px-2">450 kg/m³</td>
                       <td className="py-2 px-2 font-mono">550</td>
                     </tr>
                     <tr className="border-b border-home-grau/10">
                       <td className="py-2 px-2">Alle Expositionsklassen; ab C55/67 bzw. LC55/60</td>
                       <td className="py-2 px-2">≥ 500 kg/m³</td>
                       <td className="py-2 px-2 font-mono">600</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
               <p className="text-xs text-text-main/60 mt-3 text-justify">
                 Zwischenwerte werden linear interpoliert. Die Werte entsprechen DIN 1045-2:2008-08 (Tab. F.4.1/F.4.2). In DIN 1045-2:2023-08 sind Höchstwerte des Mehlkorngehalts entfallen; stattdessen gilt ab F3 und C25/30 ein Mindest-Leimvolumen (z. B. 280–310 l/m³ bei D_max 16) oder eine erweiterte Erstprüfung. Hinweise: Wird Zement mit hohem Zusatzstoffanteil (z.B. CEM III oder CEM II/B) verwendet oder Zusatzstoffe (FA, SF) zugegeben, verschiebt sich die Leimgemischzusammensetzung. Um Klebrigkeit oder Rissneigung zu vermeiden, darf das Mehlkorn in Abhängigkeit der Gesteinsgrößen nicht beliebig überschritten werden. Bei Sichtbeton, hochgepumptem Beton oder selbstverdichtendem Beton (SCC) können Werte bis 600 kg/m³ gezielt eingesetzt werden.
               </p>
             </div>
            <FormulaDerivationBox
              title="Anwendungsbeispiel: Mehlkorngehalt prüfen"
              zielGleichung="m_{Mk} = m_z + m_{ST} + m_{Gk \le 0{,}125\,\text{mm}} \le m_{Mk,max}"
              normQuelle="DIN 1045-2:2008-08, Tab. F.4.1 (in DIN 1045-2:2023-08 entfallen; dort Mindest-Leimvolumen)"
              schritte={[
                { titel: '1. Gegeben (Lehrwerte)', formel: '\\text{C30/37, XF1},\\; D_{max} = 16\\,\\text{mm},\\; z = 320\\,\\text{kg/m}^3', erklaerung: 'Zusätzlich 40 kg/m³ Kalksteinmehl; Sand 0/2 mit 700 kg/m³ und 3 % Anteil ≤ 0,125 mm.' },
                { titel: '2. Grenzwert interpolieren', formel: 'm_{Mk,max} = 400 + \\frac{320 - 300}{350 - 300} \\cdot 50 = 420\\,\\text{kg/m}^3', erklaerung: 'Zwischen 300 kg/m³ (400) und 350 kg/m³ (450) Zementgehalt linear interpoliert.' },
                { titel: '3. Ist-Wert', formel: 'm_{Mk} = 320 + 40 + 0{,}03 \\cdot 700 = 381\\,\\text{kg/m}^3', erklaerung: 'Zement, Zusatzstoff und Feinstanteil der Gesteinskörnung zählen zum Mehlkorn.' },
                { titel: '4. Nachweis', formel: '381 \\le 420\\,\\text{kg/m}^3', erklaerung: 'Anforderung erfüllt.' },
              ]}
              ergebnisHinweis="381 kg/m³ ≤ 420 kg/m³ – Mehlkorngehalt zulässig."
            />
          </div>
        )}

        {activeTab === 'zusatzstoffe' && (
          <div className="flex flex-col gap-6 animate-fade-in">
             <h3 className="text-lg font-bold">Betonzusatzstoffe (ST) und -zusatzmittel (ZM)</h3>
             <p className="text-sm text-text-main/80">Übersicht der üblichen Wirkstoffe (in Anlehnung an DIN EN 934 und betontechnische-daten.de Kapitel 3/4).</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
               <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                 <h4 className="font-bold text-shiraz mb-3">Zusatzmittel (ZM)</h4>
                 <ul className="space-y-3 text-sm">
                   <li><strong className="font-mono text-text-main bg-off-white px-1">BV</strong> <strong>Betonverflüssiger:</strong> Verringerung des Wasserbedarfs, Verbesserung der Verarbeitbarkeit.</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">FM</strong> <strong>Fließmittel:</strong> Starke Verflüssigung für Pumpbeton/SVB.</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">VZ</strong> <strong>Verzögerer:</strong> Verlängerung der Verarbeitungszeit (hilfreich im Sommer oder bei massigen Bauteilen, Verzögerung der Hydratation).</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">LP</strong> <strong>Luftporenbildner:</strong> Erzeugen kleiner, verteilter künstlicher Luftporen zur Erhöhung des Frost-Tausalz-Widerstands (XF4).</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">BE</strong> <strong>Beschleuniger:</strong> Erstarrungs- oder Erhärtungsbeschleuniger (z.B. für Spritzbeton).</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">ST</strong> <strong>Stabilisierer:</strong> Verhindern von Entmischung und Bluten.</li>
                 </ul>
               </div>

               <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm">
                 <h4 className="font-bold text-shiraz mb-3">Zusatzstoffe (Typ II - reaktiv)</h4>
                 <ul className="space-y-3 text-sm">
                   <li><strong className="font-mono text-text-main bg-off-white px-1">FA</strong> <strong>Flugasche (SFA):</strong> Puzzolanisch, verbessert Verarbeitbarkeit, verringert Hydratationswärme. Anrechenbar auf w/z-Wert.</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">SF</strong> <strong>Silikastaub (Microsilica):</strong> Hochreaktiv, stark festigkeitssteigernd, stark erhöhter Wasseranspruch. Für UHPC/HPC.</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">HÜS</strong> <strong>Hüttensand (HSM):</strong> Latent-hydraulisch, sehr hell, hoher Sulfatwiderstand.</li>
                 </ul>
                 <h4 className="font-bold text-shiraz mb-3 mt-6">Zusatzstoffe (Typ I - inert)</h4>
                 <ul className="space-y-3 text-sm">
                   <li><strong className="font-mono text-text-main bg-off-white px-1">KM</strong> <strong>Kalksteinmehl (LL):</strong> Füller, verbessert die Packungsdichte und Helligkeit.</li>
                   <li><strong className="font-mono text-text-main bg-off-white px-1">Farbpigmente</strong> <strong>(Eisenoxid etc.):</strong> Für Architekturbeton.</li>
                 </ul>
               </div>
             </div>

             {/* Wirkungsmechanismen der Zusatzstoffe: Hydratationswärme & ITZ */}
             <div className="p-5 bg-white rounded-2xl border border-home-grau/25 shadow-sm text-xs text-text-main/80 space-y-4">
               <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-home-grau/15">
                 <div className="font-bold text-sm text-text-main flex items-center gap-2">
                   <Sparkles size={18} className="text-shiraz" />
                   <span>Wirkungsmechanismen der Zusatzstoffe: Hydratationswärme &amp; ITZ</span>
                 </div>
                 <span className="text-[11px] font-semibold text-slate-500 bg-off-white px-2.5 py-0.5 rounded-full border border-home-grau/20">
                   Gefüge- &amp; Thermomechanik
                 </span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                 {/* Karte 1: Hydratationswärme */}
                 <div className="bg-off-white/80 p-4 rounded-xl border border-home-grau/20 flex flex-col justify-between">
                   <div>
                     <div className="font-bold text-xs text-text-main flex items-center gap-1.5 mb-2 text-orange-950">
                       <Flame size={16} className="text-orange-600" />
                       <span>1. Hydratationswärme &amp; Massenbeton</span>
                     </div>
                     <p className="text-[11px] leading-relaxed text-text-main/80 mb-2">
                       <strong>Problemstellung:</strong> Die Klinkerbestandteile (<FormulaText text="C_3S, C_3A" />) reagieren stark exotherm (Wärmefreisetzung bis ca. 500 J/g). In massigen Bauteilen (z.&nbsp;B. dicke Sohlplatten, Brückenpfeiler, Talsperren) staut sich die Reaktionswärme infolge der geringen Temperaturleitfähigkeit des Betons im Kern (oft 60–80&nbsp;°C), während die Randzonen abkühlen. Übersteigt die Temperaturdifferenz <FormulaText text="\Delta T > 15\text{–}20\text{ K}" />, entstehen massive thermische Zwangspannungen und klaffende Trennrisse.
                     </p>
                     <p className="text-[11px] leading-relaxed text-text-main/80">
                       <strong>Einfluss der Zusatzstoffe:</strong>
                     </p>
                     <ul className="list-disc list-inside text-[11px] space-y-1 text-text-main/75 mt-1 ml-1">
                       <li><strong>Flugasche (FA) &amp; Hüttensandmehl (HüS):</strong> Reagieren puzzolanisch bzw. latent-hydraulisch mit deutlicher Verzögerung (Tage bis Wochen). Die adiabatische Temperaturspitze sinkt deutlich (Lehrwert: 30–50&nbsp;%, abhängig von der Austauschrate). Die Wärme kann schadlos entweichen (Grundlage für LH-Zemente nach DIN EN 197-1 und VLH-Zemente nach DIN EN 14216).</li>
                       <li><strong>Silikastaub (SF):</strong> Beschleunigt durch extreme Keimbildungsflächen die Frühhydratation in den ersten 24–48&nbsp;h (erfordert sorgfältige frühe Nachbehandlung gegen Schwindrisse).</li>
                     </ul>
                   </div>
                   <div className="mt-3 pt-2 border-t border-home-grau/15 text-[10px] text-slate-500 font-mono">
                     Richtwerte (Praxis): Max. Kerntemperatur &lt; 65–70 °C | Gradient &Delta;T &le; 15–20 K
                   </div>
                 </div>

                 {/* Karte 2: ITZ (Interfacial Transition Zone) */}
                 <div className="bg-off-white/80 p-4 rounded-xl border border-home-grau/20 flex flex-col justify-between">
                   <div>
                     <div className="font-bold text-xs text-text-main flex items-center gap-1.5 mb-2 text-blue-950">
                       <Microscope size={16} className="text-middle-blue" />
                       <span>2. ITZ (Interfacial Transition Zone / Kontaktzone)</span>
                     </div>
                     <p className="text-[11px] leading-relaxed text-text-main/80 mb-2">
                       <strong>Was ist die ITZ?</strong> Die Kontakt- bzw. Übergangszone (ca. 10–50&nbsp;&mu;m um jedes Gesteinskorn) ist naturgemäß die <em>Sollbruchstelle („Achillesferse“)</em> des Betons. Durch den sogenannten <strong>„Wandeffekt“ (Wall Effect)</strong> können sich die relativ großen Zementkörner (10–50&nbsp;&mu;m) nicht dicht an die feste Kornoberfläche anlagern.
                     </p>
                     <p className="text-[11px] leading-relaxed text-text-main/80 mb-2">
                       <strong>Schwachstelle ohne Zusatzstoffe:</strong> An der Kornoberfläche sammelt sich freies Wasser (lokal stark überhöhter w/z-Wert). Es bilden sich großkristalliner, weicher Portlandit (<FormulaText text="\text{Ca(OH)}_2" />) und Ettringit. Die Folge: hohe Kapillarporosität, geringe Verbundfestigkeit und durchgängige Kanäle für Chloride, Frost und Säuren.
                     </p>
                     <p className="text-[11px] leading-relaxed text-text-main/80">
                       <strong>Optimierung durch Zusatzstoffe:</strong>
                     </p>
                     <ul className="list-disc list-inside text-[11px] space-y-1 text-text-main/75 mt-1 ml-1">
                       <li><strong>Mikro-Füllereffekt:</strong> Nanofeiner Silikastaub (&Oslash; ca. 0,1&nbsp;&mu;m = 100-mal kleiner als Zement), Feinstflugasche dringen direkt in die Kornzwischenräume ein und verdrängen den Wasserfilm.</li>
                       <li><strong>Puzzolanische Phasenumwandlung:</strong> Sie wandeln den löslichen Portlandit chemisch in extrem dichte, feste C-S-H-Phasen um: <span className="font-mono text-shiraz text-[10px] block mt-0.5">Ca(OH)₂ + SiO₂ + H₂O &rarr; C-S-H</span></li>
                     </ul>
                   </div>
                   <div className="mt-3 pt-2 border-t border-home-grau/15 text-[10px] text-slate-500 font-mono">
                     Ergebnis: Homogene Kontaktzone | Deutlich höhere Biegezug-, Spaltzug- &amp; Abriebfestigkeit
                   </div>
                 </div>
               </div>
             </div>
            <FormulaDerivationBox
              title="Anwendungsbeispiel: Äquivalenter w/z-Wert mit Flugasche"
              zielGleichung="(w/z)_{eq} = \frac{w}{z + k_f \cdot f}"
              normQuelle="DIN 1045-2 (Anrechnung von Flugasche, k_f = 0,4; f/z ≤ 0,33)"
              schritte={[
                { titel: '1. Gegeben (Lehrwerte)', formel: 'z = 280\\,\\text{kg/m}^3,\\; f = 80\\,\\text{kg/m}^3,\\; w = 160\\,\\text{kg/m}^3', erklaerung: 'Bauteil der Expositionsklasse XC4, Flugasche als Zusatzstoff Typ II.' },
                { titel: '2. Anrechenbare Flugaschemenge prüfen', formel: 'f/z = 80/280 = 0{,}29 \\le 0{,}33', erklaerung: 'Die gesamte Flugasche darf angerechnet werden.' },
                { titel: '3. Einsetzen', formel: '(w/z)_{eq} = \\frac{160}{280 + 0{,}4 \\cdot 80} = \\frac{160}{312} = 0{,}51', erklaerung: 'Der k-Wert berücksichtigt die geringere Wirksamkeit der Flugasche gegenüber Zement.' },
                { titel: '4. Nachweis', formel: '0{,}51 \\le (w/z)_{max} = 0{,}60\\;(\\text{XC4})', erklaerung: 'Anforderung erfüllt. Ohne Anrechnung ergäbe sich w/z = 160/280 = 0,57.' },
              ]}
              ergebnisHinweis="(w/z)eq = 0,51 ≤ 0,60 – die Flugasche verbessert den rechnerischen Wasserzementwert."
            />
            <ExpositionsKurzkarte hinweis="Ob und in welchem Umfang Zusatzstoffe angerechnet und rezyklierte Gesteinskörnungen verwendet werden dürfen, hängt von der Expositionsklasse ab. Grenzwerte (w/z, Mindestfestigkeit, Zementgehalt) stehen im Modul Expositionsklassen." />
          </div>
        )}

      </div>

      <ModulTest moduleId="grundlagen" />

      <ModuleFooter
        wikipedia={[
          { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Gesteinskörnung', url: 'https://de.wikipedia.org/wiki/Gesteinsk%C3%B6rnung' },
          { title: 'Expositionsklasse', url: 'https://de.wikipedia.org/wiki/Expositionsklasse' },
          { title: 'Wasserzementwert', url: 'https://de.wikipedia.org/wiki/Wasserzementwert' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Grübl, P., Weigler, H., Karl, S.: Beton – Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'Zement-Taschenbuch (Verein Deutscher Zementwerke e.V., Verlag Bau+Technik)'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Spannbeton - Teil 2: Beton)' },
          { title: 'DIN EN 197-1 (Zement - Teil 1: Zusammensetzung, Anforderungen und Konformitätskriterien)' },
          { title: 'DIN EN 1008:2002-10 (Zugabewasser für Beton – Festlegung für die Probenahme, Prüfung und Beurteilung der Eignung)' },
          { title: 'DIN EN 12620:2008-07 (Gesteinskörnungen für Beton)' },
          { title: 'DAfStb-Richtlinie Vorbeugende Maßnahmen gegen schädigende Alkalireaktion im Beton (Alkali-Richtlinie)' }
        ]}
        formeln={[
          {
            formel: '(w/z)_{eq} = \\frac{w}{z + k \\cdot f}',
            erklaerung: 'Äquivalenter Wasserzementwert unter Berücksichtigung reaktiver puzzolanischer oder latent-hydraulischer Betonzusatzstoffe Typ II (Flugasche, Silikastaub) mit dem Anrechnungsfaktor k.',
            quelle: 'DIN 1045-2 / DIN EN 206'
          },
          {
            formel: 'm_{Mehlkorn} = m_z + m_{ST} + m_{Gestein \\le 0{,}125\\,\\text{mm}}',
            erklaerung: 'Mehlkorngehalt zur Sicherung des Wasserhaltevermögens und der Gefügedichtigkeit im Frischbeton.',
            quelle: 'DIN 1045-2'
          }
        ]}
      />
    </div>
  );
}

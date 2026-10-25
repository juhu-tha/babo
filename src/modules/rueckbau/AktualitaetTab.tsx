import { Recycle, FileCheck, ShieldAlert } from 'lucide-react';

export interface AktualitaetTabProps {

}

export function AktualitaetTab({  }: AktualitaetTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
        <h3 className="text-base font-bold text-text-main mb-2">Aktualisierung &amp; Gesetzlicher Status</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Der alte LfU Leitfaden bezieht sich teilweise auf historische Verordnungen und die alten Richtlinien 
            der Bund/Länder-Arbeitsgemeinschaft Abfall (<strong>LAGA Mitteilung 20</strong>). Es ist von überragender 
            Wichtigkeit, die Neuerungen im Baurecht für nachhaltiges Bauen und Demontage zu kennen:
          </p>
        </div>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Old vs New Mineral Recycling */}
          <div className="border border-shiraz/20 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-shiraz/10 p-3 px-4 text-xs font-bold text-shiraz border-b border-shiraz/20 uppercase tracking-wider">
              Mineralische Bauabfälle: LAGA M 20 vs. EBV 2023
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-slate-50 p-2.5 rounded text-xs text-slate-600">
                <span className="font-bold text-slate-800 uppercase text-xs block">Historischer Zustand (LAGA M 20):</span>
                Föderalismus führte zu uneinheitlichen Grenzwerten und Richtlinien. In Bayern galt z.B. der RC-Leitfaden des LfU mit den Einstufungen unbedenklich (Z0), eingeschränkt (Z1.1, Z1.2) oder deponierungsbedürftig (Z2).
              </div>
              
              <div className="bg-emerald-50 p-2.5 rounded text-xs text-emerald-800 border border-emerald-200">
                <span className="font-bold text-emerald-900 uppercase text-xs block">Neuer Zustand seit August 2023 (Ersatzbaustoffverordnung):</span>
                Einführung einer bundesweit harmonisierten Bundes-Ersatzbaustoffverordnung (EBV). Die alten LAGA M20-Klassen wurden durch einheitliche Materialklassen ersetzt (Bodenmaterial BM-0/F1/F2/F3, Recycling-Baustoff RC-1/RC-2/RC-3). Vorgeschriebene Güteüberwachung und Anzeige von Großbaustellen im Ersatzbaustoffkataster sind Pflicht.
              </div>
            </div>
          </div>
    
          {/* Card 2: GewAbfV and Circularity */}
          <div className="border border-indigo-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-indigo-50 p-3 px-4 text-xs font-bold text-indigo-800 border-b border-indigo-200 uppercase tracking-wider">
              Gewerbeabfallverordnung (GewAbfV) & Getrenntsammlung
            </div>
            <div className="p-4 space-y-4 text-xs text-text-main leading-relaxed">
              <div>
                <span className="font-bold text-slate-800 block">Strenge Getrennthaltungsgebote:</span>
                Die GewAbfV verlangt die lückenlose Dokumentation und Separation von mindestens 10 Kernfraktionen an der Bau- und Abbruchstelle. 
              </div>
              
              <div className="bg-indigo-50/50 p-3 rounded border border-indigo-100 space-y-2">
                <span className="font-bold text-indigo-900 block text-xs uppercase">Gemische (§ 9 GewAbfV):</span>
                Eine feste Getrenntsammlungsquote für Bauabfälle kennt die GewAbfV nicht. Ist die Getrennthaltung technisch nicht möglich oder wirtschaftlich unzumutbar, gehen Gemische mit überwiegend Kunststoff, Metall oder Holz in eine Vorbehandlungsanlage (Sortierquote der Anlage <strong>mindestens 85 %</strong>), mineralische Gemische in eine Aufbereitungsanlage (§ 9 GewAbfV).
              </div>
    
              <div className="bg-white rounded border border-amber-300 p-2.5 text-xs text-amber-800">
                <strong>Achtung Bußgeldgefahr:</strong> Ausbleibende Getrenntsammlungs-Dokumentation (Fotobeweise, Wiegescheine, Entsorgungserklärungen) stellt eine Ordnungswidrigkeit dar und kann hohe Strafen nach sich ziehen.
              </div>
            </div>
          </div>
        </div>
      </div>
    
      {/* Table comparison representation */}
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm overflow-x-auto">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/70 mb-3">Rechtliche Konsequenzen für die Bauleitung</h4>
        <table className="min-w-full text-xs text-left text-text-main">
          <thead className="bg-slate-50 uppercase text-xs text-text-main/60 border-b border-home-grau/30">
            <tr>
              <th className="py-3 px-4">Themenfeld</th>
              <th className="py-3 px-4">Alte Praxis (LfU historisch)</th>
              <th className="py-3 px-4">Aktuelle Vorschrift (2026 / EBV)</th>
              <th className="py-3 px-4">Handlungsempfehlung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-home-grau/15">
            <tr>
              <td className="py-3 px-4 font-bold">Verwertung im Erdbau</td>
              <td className="py-3 px-4">Verwertungs-Leitfaden Bayern (Z0 bis Z2)</td>
              <td className="py-3 px-4 font-semibold text-emerald-800">Ersatzbaustoffverordnung (BM-0 bis BM-F3)</td>
              <td className="py-3 px-4">Nur chargenweise im Labor (nach PN 98) freigegebenes RC-Material einbauen.</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold">Bauschutt-Transport</td>
              <td className="py-3 px-4">Einfache Transportbelege in Papierform</td>
              <td className="py-3 px-4 font-semibold text-red-800">Nachweisverfahren elektronisch (eANV)</td>
              <td className="py-3 px-4">Für alle gefährlichen Abfälle Signaturkarte bereithalten und Begleitscheine am PC zeichnen.</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold">Wiederverwertung Beton</td>
              <td className="py-3 px-4">RC-Material meist im Straßenunterbau deponiert</td>
              <td className="py-3 px-4 font-semibold text-emerald-800">Kreislaufbeton (R-Beton nach DIN EN 206)</td>
              <td className="py-3 px-4">Zerkleinerte Gesteinskörnung im Hochbau einsetzen. Spart mineralischen Primärschotter.</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold">Rückbau-Konzepterstellung</td>
              <td className="py-3 px-4">Optional bei kleineren Bauvorhaben</td>
              <td className="py-3 px-4 font-semibold text-amber-800">Materialpasspflicht & Ressourcenpass-Vorbereitung</td>
              <td className="py-3 px-4">Digitalisierung von Gebäuden mit BIM-Schadstoffkatastern (Madaster / Ressourcenpass).</td>
            </tr>
          </tbody>
        </table>
      </div>
    
      {/* Neue Normengruppe: DIN SPEC 91525, DIN SPEC 91484, VDI 6210, DIN 18007 */}
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-home-grau/20">
          <h4 className="text-base font-bold text-text-main flex items-center gap-2">
            <FileCheck size={18} className="text-shiraz" />
            Aktuelle Schlüsselstandards für Rückbau, Schadstoffsanierung &amp; Zirkularität
          </h4>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-shiraz/10 text-shiraz rounded-full border border-shiraz/20">
            Normenstand 2024–2026
          </span>
        </div>
        <p className="text-xs text-text-main/80 leading-relaxed">
          Für eine rechtlich belastbare Planung, die Ausschreibung und den kontrollierten selektiven Rückbau bilden neben der EBV und GewAbfV vier spezialisierte Regelwerke das normative Fundament:
        </p>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DIN SPEC 91525 */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-shiraz text-white rounded">
                  DIN SPEC 91525
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Anschlussnutzungskonzept (2026-02)</span>
              </div>
              <h5 className="font-bold text-sm text-text-main">
                Anschlussnutzungskonzept für Bauprodukte aus Bestandsgebäuden
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Beschreibt ein Konzept (Post-Use Concept), wie ausgebaute Bauprodukte aus Bestandsgebäuden einer Anschlussnutzung – Wiederverwendung oder hochwertigem Recycling – zugeführt werden. Baut auf der Erfassung nach DIN SPEC 91484 auf.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
              <span>Fokus: Wiederverwendung, Anschlussnutzung</span>
              <span className="font-mono font-bold text-shiraz">DIN SPEC 91525:2026-02</span>
            </div>
          </div>
    
          {/* DIN SPEC 91484 */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-shiraz text-white rounded">
                  DIN SPEC 91484
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Pre-Demolition Audit</span>
              </div>
              <h5 className="font-bold text-sm text-text-main">
                Erfassung von Bauprodukten vor Abbruch- und Renovierungsarbeiten
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Verfahren zur Erfassung von Bauprodukten als Grundlage für die Bewertung ihres Anschlussnutzungspotenzials vor Abbruch- und Renovierungsarbeiten (Pre-Demolition Audit). Die Schadstofferkundung erfolgt ergänzend nach VDI 6202.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
              <span>Fokus: Bauteilinventar, Wiederverwendungspotenzial</span>
              <span className="font-mono font-bold text-shiraz">DIN SPEC 91484:2023-09</span>
            </div>
          </div>
    
          {/* VDI 6210 */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-800 text-white rounded">
                  VDI 6210 Blatt 1
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Abbruch &amp; Schadstoffsanierung</span>
              </div>
              <h5 className="font-bold text-sm text-text-main">
                Abbruch von baulichen und technischen Anlagen
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Regelt die technische Durchführung, Arbeitsschutz-, Standsicherheits- und Umweltaspekte beim Abbruch von Bauwerken und Industrieanlagen. Ergänzt VDI 6202 (schadstoffbelastete Anlagen) um konkrete Rückbau- und Abbruchverfahren. Aktuelle Ausgabe 2025-10 (ersetzt 2016-02).
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
              <span>Fokus: Abbruchstatik, Entkernung, Emissionsschutz</span>
              <span className="font-mono font-bold text-slate-800">VDI 6210 Blatt 1:2025-10</span>
            </div>
          </div>
    
          {/* DIN 18007 */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-800 text-white rounded">
                  DIN 18007
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Abbrucharbeiten - Begriffe &amp; Verfahren</span>
              </div>
              <h5 className="font-bold text-sm text-text-main">
                Abbrucharbeiten – Begriffe, Verfahren, Anwendungsbereiche
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Die übergeordnete nationale Grundnorm für Abbrucharbeiten. Definiert einheitliche Begriffe, Abbruchverfahren (z. B. Demontieren, Abtragen, Einreißen, Sprengen) und deren Anwendungsbereiche.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
              <span>Fokus: Abbruchverfahren, Begriffsdefinitionen</span>
              <span className="font-mono font-bold text-slate-800">DIN 18007:2022-09</span>
            </div>
          </div>
        </div>
      </div>
    
      {/* Detailliertes Fachmodul: Ersatzbaustoffverordnung (EBV) & GefStoffV 2024/2026 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EBV Systematik */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-home-grau/20">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <Recycle size={18} className="text-shiraz" />
              Ersatzbaustoffverordnung (EBV) – Materialklassen &amp; Einbauweisen
            </h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
              Seit 01.08.2023 Bundesrecht
            </span>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Die EBV harmonisiert das Recycling mineralischer Baustoffe bundesweit verbindlich und löst LAGA M20 ab. 
            Sie definiert konkrete Materialklassen und Einbauweisen abhängig von den hydrogeologischen Bedingungen (Grundwasserabstand, Wasserschutzgebiet):
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15">
              <strong className="text-shiraz block mb-1">Recycling-Baustoffe (RC-1, RC-2, RC-3):</strong>
              <ul className="list-disc list-inside space-y-0.5 text-text-main/80 text-[11px]">
                <li><strong>RC-1:</strong> Höchste Güteklasse (geringste Eluatwerte). Breiteste Verwendbarkeit, u. a. in ungebundenen Tragschichten; Grenzen ergeben sich aus Grundwasserdeckschicht und Schutzgebieten (§ 19 EBV).</li>
                <li><strong>RC-2:</strong> Mittlere Belastung. Einbau nur in den nach Anlage 2 EBV zulässigen Einbauweisen (überwiegend gebunden oder unter wasserundurchlässiger Deckschicht).</li>
                <li><strong>RC-3:</strong> Stark eingeschränkter Einbau mit bautechnischer Sicherung; ab 250 m³ Voranzeige vier Wochen vor Beginn und Abschlussanzeige bei der zuständigen Behörde (§ 22 EBV).</li>
              </ul>
            </div>
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15">
              <strong className="text-slate-800 block mb-1">Bodenmaterial (BM) &amp; Gleisschotter (GS):</strong>
              <p className="text-[11px] text-text-main/80 leading-relaxed">
                Klassen BM-0 (unbelasteter Oberboden/Boden), BM-F1 bis BM-F3 sowie GS-0 bis GS-3. Maßgebend ist die Grundwasserdeckschicht über dem höchsten zu erwartenden Grundwasserstand: günstig bei mehr als 1 m Sickerstrecke zuzüglich 0,5 m Sicherheitsabstand (§ 19 Abs. 8 EBV); in Karst- oder stark klüftigen Gebieten sind RC-3, BM-F3, BG-F3 und GS-3 unzulässig (§ 19 Abs. 7).
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-700 font-mono">
              Güteüberwachung nach EBV: Eignungsnachweis + Werkseigene Produktionskontrolle (WPK) + regelmäßige Fremdüberwachung durch akkreditierte Prüfstellen.
            </div>
          </div>
        </div>
    
        {/* GefStoffV & TRGS 519 Ampelmodell */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-home-grau/20">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <ShieldAlert size={18} className="text-shiraz" />
              GefStoffV-Novelle &amp; TRGS 519 – Bauherrenpflicht &amp; Ampelmodell
            </h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-red-50 text-red-800 rounded border border-red-200">
              GefStoffV seit 05.12.2024
            </span>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Die novellierte Gefahrstoffverordnung (GefStoffV) verankert in § 5a eine 
            <strong>Mitwirkungs- und Informationspflicht des Bauherrn/Veranlassers</strong> – eine generelle Erkundungspflicht wurde nicht eingeführt:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-red-50/40 rounded-lg border border-red-200 space-y-1">
              <strong className="text-red-900 block text-xs">Informationspflicht des Veranlassers (§ 5a GefStoffV):</strong>
              <p className="text-[11px] text-red-950/80 leading-relaxed">
                Vor Beginn der Arbeiten übergibt der Veranlasser alle ihm vorliegenden Informationen zur Bau- und Nutzungsgeschichte und zu vermuteten Gefahrstoffen, mindestens das Baujahr (bei 1993–1996 den Baubeginn). Ob Asbest (z. B. in Spachtelmassen, Fliesenklebern, Putzen) vorhanden ist, klärt das ausführende Unternehmen in der Gefährdungsbeurteilung – fachlich empfohlen durch Erkundung nach VDI 6202 Blatt 3:2021-09.
              </p>
            </div>
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1.5">
              <strong className="text-text-main block text-xs">Risikobasiertes Maßnahmenkonzept (GefStoffV Anhang I Nr. 2, TRGS 519):</strong>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <div className="p-2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Grün: &lt; 10.000 F/m³
                  <span className="font-normal block text-[9.5px] mt-0.5 text-emerald-800">Niedriges Risiko (z. B. BT-Verfahren)</span>
                </div>
                <div className="p-2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Gelb: 10.000–100.000 F/m³
                  <span className="font-normal block text-[9.5px] mt-0.5 text-amber-800">Mittleres Risiko (Genehmigung bei Abbruch)</span>
                </div>
                <div className="p-2 rounded bg-red-100 text-red-900 border border-red-300">
                  Rot: &gt; 100.000 F/m³
                  <span className="font-normal block text-[9.5px] mt-0.5 text-red-800">Hohes Risiko (Zulassung, Schwarz-Weiß-Anlage)</span>
                </div>
              </div>
              <p className="text-[11px] text-text-main/70 leading-relaxed pt-1">
                Bauen im Bestand erfordert bei abrasiven Tätigkeiten (Fräsen, Schleifen, Stemmen) baumustergeprüfte Entstauber der Staubklasse H und zertifizierte emissionsarme Verfahren (BT-Verfahren).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

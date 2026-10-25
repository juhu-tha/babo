import { AlertTriangle, Recycle } from 'lucide-react';

export default function LeitfadenDgnbQng() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Schritt 5 von 5</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            DGNB- &amp; QNG-Zertifizierungsprozess (Qualitätssiegel)
          </h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          Nach Abschluss der Bauteilbilanzierung werden die Einzelergebnisse zum Gebäude zusammengesetzt. In der Praxis dienen zwei führende Zertifizierungs- und Qualitätssiegel-Verfahren zur Validierung der Nachhaltigkeit:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* DGNB Column */}
          <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase rounded">DGNB</span>
              <strong className="text-xs font-bold text-slate-900">DGNB-Zertifizierungssystem</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Ein ganzheitlicher, freiwilliger Systemansatz der Deutschen Gesellschaft für Nachhaltiges Bauen. Bewertet 6 Themenfelder über 50 Jahre Betrachtungszeitraum.
            </p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 leading-normal">
              <li>Auszeichnungsklassen: Platin (≥ 80%), Gold (≥ 65%), Silber (≥ 50%), Bronze (≥ 35%).</li>
              <li>Verbindet Ökobilanz (GWP, ODP) mit ökonomischen Lebenszykluskosten (LCC) und soziokulturellem Komfort.</li>
              <li>Fördert sortenreinen Modulrückbau durch CE-Bonuspunkte.</li>
            </ul>
          </div>

          {/* QNG Column */}
          <div className="p-4 bg-sky-50/20 border border-sky-100 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold text-[10px] uppercase rounded">QNG</span>
              <strong className="text-xs font-bold text-slate-900">QNG-Siegel (BMWSB)</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Das staatliche <strong>Qualitätssiegel Nachhaltiges Gebäude</strong> ist Voraussetzung für die Inanspruchnahme der zinsgünstigen KFN-Förderung (Klimafreundlicher Neubau) der KfW-Bank.
            </p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 leading-normal">
              <li><strong>QNG-Plus:</strong> ≤ 24 kg CO₂-eq/(m² NRF · a) (LCA über 50 Jahre; PENRT ≤ 96 kWh/(m² NRF · a)).</li>
              <li><strong>QNG-Premium:</strong> ≤ 20 kg CO₂-eq/(m² NRF · a) (PENRT ≤ 64 kWh/(m² NRF · a); erfordert z. B. sehr gut gedämmten Holz- oder Hybridbau).</li>
              <li>Strikte Pflichten zur schadstofffreien Baustoffwahl auf der Baustelle.</li>
            </ul>
          </div>

        </div>

        {/* Intersect with Schadstoffvermeidung */}
        <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 rounded-xl p-4 flex flex-col gap-2">
          <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5 uppercase">
            <AlertTriangle size={14} className="text-amber-700" />
            Schadstoffvermeidung als QNG-Ausschlusskriterium:
          </h4>
          <p className="text-[11px] text-amber-950 leading-relaxed">
            Das beste Gebäude-GWP nützt nichts, wenn schadstoffhaltige Materialien verbaut werden. Die QNG-Zertifizierung definiert strikte Grenzwerte für Organische Halogenverbindungen, Biozide, Blei und flüchtige organische Verbindungen (VOCs) in Farben, Klebern und Dämmstoffen. Machen Sie sich mit diesen Anforderungen im Modul <strong>Schadstoffe</strong> sowie im Modul <strong>Farben &amp; Lacke</strong> vertraut, um Planungsfehler im Zertifizierungsprozess zu verhindern!
          </p>
        </div>

        {/* Urban Mining Index (UMI) & Zirkularitäts-Kennwerte */}
        <div className="bg-white border border-home-grau/25 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
              <Recycle size={14} className="text-shiraz" />
              Zirkularitätsmetriken: Urban Mining Index (UMI) &amp; Materialpässe
            </h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Zirkuläres Bauen
            </span>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed">
            Moderne Ökobilanzierungen und DGNB-/QNG-Audits bewerten neben GWP zunehmend die Kreislauffähigkeit von Bauteilen:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1">
              <span className="font-bold text-shiraz block text-xs">Urban Mining Index (UMI):</span>
              <p className="text-[11px] text-text-main/70 leading-relaxed">
                Gibt an, wie viel Prozent der Baustoffmasse nach dem Rückbau tatsächlich wieder hochwertig in den Stoffkreislauf zurückgeführt werden können (Closed-Loop-Recyclingquote abzüglich Downcycling und Deponieanteil).
              </p>
            </div>
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1">
              <span className="font-bold text-indigo-700 block text-xs">Materialpässe (Madaster / DIN SPEC 91525):</span>
              <p className="text-[11px] text-text-main/70 leading-relaxed">
                Digitale Inventarisierung aller verbauten Werkstoffe, Schadstofffreiheit und Demontagepfade auf Bauteilebene für zukünftige Rückbauaudits.
              </p>
            </div>
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1">
              <span className="font-bold text-emerald-700 block text-xs">Trennbarkeit von Verbundbauteilen:</span>
              <p className="text-[11px] text-text-main/70 leading-relaxed">
                Präferenz mechanisch lösbarer Verbindungen (Schrauben, Stecken) statt vollflächiger Verklebungen oder Verbundestrichen, um sortenreines Trennen im Rückbau zu garantieren.
              </p>
            </div>
          </div>
        </div>

        {/* QNG Qualitätsstufen Schadstoffvermeidung (Dokument 313) */}
        <div className="bg-white border border-home-grau/25 rounded-xl p-4 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
            <AlertTriangle size={14} className="text-amber-600" />
            QNG-Schadstoffvermeidung: Qualitätsstufen (QS1-QS4) nach Steckbrief 313
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Neben den GWP-Grenzdaten ist die absolute **Schadstofffreiheit** das schärfste Ausschlusskriterium im QNG. Alle bauchemischen Produkte müssen in Qualitätsstufen eingeordnet werden:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mt-1">
            {[
              { 
                stufe: 'QS 1', 
                title: 'Gesetzlich konform', 
                desc: 'Erfüllt das REACH-Minimum. Kaum förderfähig für anspruchsvolle Zertifikate.', 
                style: 'bg-red-50 border-red-200 text-red-950 shadow-2xs' 
              },
              { 
                stufe: 'QS 2', 
                title: 'Standard-Qualität', 
                desc: 'Grundlegende Schadstoffreduzierung, z.B. lösemittelarme Dispersionsklebstoffe.', 
                style: 'bg-amber-50 border-amber-100 text-amber-950 shadow-2xs' 
              },
              { 
                stufe: 'QS 3', 
                title: 'Erhöhte Qualität', 
                desc: 'Sehr emissionsarme Produkte, z.B. weichmacherfreie Innenfarben.', 
                style: 'bg-blue-50 border-blue-150 text-blue-950 shadow-2xs' 
              },
              { 
                stufe: 'QS 4', 
                title: 'Spitzen-Qualität', 
                desc: 'Lösemittel- und weichmacherfrei (z.B. Blauer Engel oder EMICODE EC1 Plus).', 
                style: 'bg-emerald-50 border-emerald-150 text-emerald-950 font-semibold shadow-2xs' 
              }
            ].map((item, idx) => (
              <div key={idx} className={`p-2.5 rounded-lg border flex flex-col gap-1 ${item.style}`}>
                <strong className="text-[11px] uppercase tracking-wider block font-bold">{item.stufe}</strong>
                <span className="text-[9px] font-bold block leading-tight">{item.title}</span>
                <p className="text-[9px] text-slate-600 mt-1 leading-normal font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
}
